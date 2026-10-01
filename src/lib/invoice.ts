import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";
import { buildQuote } from "@/lib/pricing";
import { BASE_CURRENCY, getCurrentRate } from "@/lib/currency";
import { convertMinor } from "@/lib/money";
import type { ServiceLevel } from "@/lib/statuses";

async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  for (let i = 0; i < 6; i++) {
    const candidate = `INV-${year}-${String(randomInt(100000, 999999))}`;
    const existing = await prisma.invoice.findUnique({ where: { number: candidate }, select: { id: true } });
    if (!existing) return candidate;
  }
  return `INV-${year}-${Date.now()}`;
}

/**
 * Creates an invoice as a permanent snapshot: prices, fees, currency and the
 * exchange rate are copied onto the invoice. Changing a price or a rate
 * tomorrow never alters an invoice issued today.
 */
export async function createInvoiceForApplication(params: {
  applicationId: string;
  serviceLevel?: ServiceLevel;
  chargeCurrency?: string;
  createdBy: { type: "ADMIN" | "CUSTOMER" | "PARTNER" | "SYSTEM"; id?: string | null };
  notes?: string | null;
}) {
  const application = await prisma.application.findUnique({
    where: { id: params.applicationId },
    select: { id: true, service: true, serviceLevel: true, customerId: true, partnerId: true },
  });
  if (!application) return { error: "Application not found." as const };

  const serviceLevel = (params.serviceLevel ?? (application.serviceLevel as ServiceLevel)) || "STANDARD";
  const quote = await buildQuote({ serviceKey: application.service, serviceLevel });
  if (!quote) return { error: "No active price is configured for this service." as const };

  const chargeCurrency = params.chargeCurrency ?? BASE_CURRENCY;
  const rate = await getCurrentRate(chargeCurrency);
  if (!rate) return { error: `No exchange rate is configured for ${chargeCurrency}.` as const };

  const currencyRow =
    chargeCurrency === BASE_CURRENCY
      ? { minorUnits: 2 }
      : await prisma.currency.findUnique({ where: { code: chargeCurrency }, select: { minorUnits: true } });
  if (!currencyRow) return { error: `Currency ${chargeCurrency} is not configured.` as const };

  // Only what MISR VISA collects is charged; airport fees are shown but not billed.
  const subtotalUsdMinor = quote.payableNowUsdMinor;
  const totalChargeMinor = convertMinor(subtotalUsdMinor, rate.rate, currencyRow.minorUnits);
  const number = await generateInvoiceNumber();

  const invoice = await prisma.invoice.create({
    data: {
      number,
      applicationId: application.id,
      customerId: application.customerId,
      partnerId: application.partnerId,
      status: "ISSUED",
      serviceLevel,
      baseCurrency: BASE_CURRENCY,
      subtotalUsdMinor,
      totalUsdMinor: subtotalUsdMinor,
      chargeCurrency,
      exchangeRate: rate.rate.toFixed(6),
      exchangeRateId: rate.id,
      totalChargeMinor,
      notes: params.notes ?? null,
      createdByType: params.createdBy.type,
      createdById: params.createdBy.id ?? null,
      lines: {
        create: quote.lines.map((line) => ({
          kind: line.kind,
          label: line.label,
          quantity: line.quantity,
          unitUsdMinor: line.unitUsdMinor,
          amountUsdMinor: line.amountUsdMinor,
          servicePriceId: line.servicePriceId ?? null,
          payableAtAirport: line.payableAtAirport,
          sortOrder: line.sortOrder,
        })),
      },
    },
    include: { lines: { orderBy: { sortOrder: "asc" } } },
  });

  return { invoice };
}

export async function getInvoiceForCustomer(invoiceId: string, customerId: string) {
  return prisma.invoice.findFirst({
    where: { id: invoiceId, customerId },
    include: { lines: { orderBy: { sortOrder: "asc" } }, payments: { orderBy: { createdAt: "desc" } } },
  });
}
