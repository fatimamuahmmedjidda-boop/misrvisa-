import { prisma } from "@/lib/prisma";
import type { ServiceLevel } from "@/lib/statuses";

/**
 * Prices live in the database and are versioned: a change closes the current
 * version and creates a new one, so invoices issued yesterday can always be
 * explained by the price that was in force yesterday.
 */

export interface QuoteLine {
  kind: "SERVICE_FEE" | "VIP_SURCHARGE" | "GOVERNMENT_FEE" | "QR_FEE" | "OPTIONAL_SERVICE" | "DISCOUNT";
  label: string;
  quantity: number;
  unitUsdMinor: number;
  amountUsdMinor: number;
  servicePriceId?: string | null;
  /** Collected by the Egyptian authorities at Cairo Airport, not by MISR VISA. */
  payableAtAirport: boolean;
  sortOrder: number;
}

export interface Quote {
  serviceId: string;
  serviceName: string;
  serviceLevel: ServiceLevel;
  servicePriceId: string;
  currency: string;
  lines: QuoteLine[];
  /** What MISR VISA actually charges now. */
  payableNowUsdMinor: number;
  /** Government fees the traveler pays on arrival. */
  payableAtAirportUsdMinor: number;
  totalUsdMinor: number;
}

export async function listServices(activeOnly = true) {
  return prisma.service.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { prices: { where: { effectiveTo: null }, orderBy: { effectiveFrom: "desc" }, take: 1 } },
  });
}

export async function getServiceBySlugOrDbValue(key: string) {
  return prisma.service.findFirst({ where: { OR: [{ slug: key }, { dbValue: key }] } });
}

export async function getCurrentPrice(serviceId: string) {
  return prisma.servicePrice.findFirst({
    where: { serviceId, effectiveTo: null },
    orderBy: { effectiveFrom: "desc" },
  });
}

export async function getPriceHistory(serviceId: string, take = 20) {
  return prisma.servicePrice.findMany({
    where: { serviceId },
    orderBy: { effectiveFrom: "desc" },
    take,
  });
}

/** Creates a new price version; the previous version is closed, never overwritten. */
export async function publishPrice(params: {
  serviceId: string;
  serviceFeeMinor: number;
  vipSurchargeMinor: number;
  governmentFeeMinor: number;
  qrFeeMinor: number;
  note?: string | null;
  actor: { id?: string | null; email?: string | null };
}) {
  const now = new Date();
  return prisma.$transaction(async (tx) => {
    await tx.servicePrice.updateMany({
      where: { serviceId: params.serviceId, effectiveTo: null },
      data: { effectiveTo: now },
    });
    return tx.servicePrice.create({
      data: {
        serviceId: params.serviceId,
        currency: "USD",
        serviceFeeMinor: params.serviceFeeMinor,
        vipSurchargeMinor: params.vipSurchargeMinor,
        governmentFeeMinor: params.governmentFeeMinor,
        qrFeeMinor: params.qrFeeMinor,
        effectiveFrom: now,
        note: params.note ?? null,
        createdById: params.actor.id ?? null,
        createdByEmail: params.actor.email ?? null,
      },
    });
  });
}

/**
 * Builds a quote from the price version in force right now. Fees are separate
 * line items — the government arrival fee and the QR fee are never merged into
 * one "visa price", and they are only added when the service is configured for
 * them.
 */
export async function buildQuote(params: { serviceKey: string; serviceLevel: ServiceLevel }): Promise<Quote | null> {
  const service = await getServiceBySlugOrDbValue(params.serviceKey);
  if (!service || !service.active) return null;

  const price = await getCurrentPrice(service.id);
  if (!price) return null;

  const lines: QuoteLine[] = [
    {
      kind: "SERVICE_FEE",
      label: `${service.name} — MISR VISA assistance`,
      quantity: 1,
      unitUsdMinor: price.serviceFeeMinor,
      amountUsdMinor: price.serviceFeeMinor,
      servicePriceId: price.id,
      payableAtAirport: false,
      sortOrder: 10,
    },
  ];

  if (params.serviceLevel === "VIP" && price.vipSurchargeMinor > 0) {
    lines.push({
      kind: "VIP_SURCHARGE",
      label: "VIP same-day processing",
      quantity: 1,
      unitUsdMinor: price.vipSurchargeMinor,
      amountUsdMinor: price.vipSurchargeMinor,
      servicePriceId: price.id,
      payableAtAirport: false,
      sortOrder: 20,
    });
  }

  if (service.appliesGovernmentFee && price.governmentFeeMinor > 0) {
    lines.push({
      kind: "GOVERNMENT_FEE",
      label: "Government visa-on-arrival fee (paid at Cairo Airport)",
      quantity: 1,
      unitUsdMinor: price.governmentFeeMinor,
      amountUsdMinor: price.governmentFeeMinor,
      servicePriceId: price.id,
      payableAtAirport: true,
      sortOrder: 30,
    });
  }

  if (service.appliesQrFee && price.qrFeeMinor > 0) {
    lines.push({
      kind: "QR_FEE",
      label: "QR code fee (paid at Cairo Airport)",
      quantity: 1,
      unitUsdMinor: price.qrFeeMinor,
      amountUsdMinor: price.qrFeeMinor,
      servicePriceId: price.id,
      payableAtAirport: true,
      sortOrder: 40,
    });
  }

  const payableNowUsdMinor = lines.filter((l) => !l.payableAtAirport).reduce((t, l) => t + l.amountUsdMinor, 0);
  const payableAtAirportUsdMinor = lines.filter((l) => l.payableAtAirport).reduce((t, l) => t + l.amountUsdMinor, 0);

  return {
    serviceId: service.id,
    serviceName: service.name,
    serviceLevel: params.serviceLevel,
    servicePriceId: price.id,
    currency: price.currency,
    lines,
    payableNowUsdMinor,
    payableAtAirportUsdMinor,
    totalUsdMinor: payableNowUsdMinor + payableAtAirportUsdMinor,
  };
}
