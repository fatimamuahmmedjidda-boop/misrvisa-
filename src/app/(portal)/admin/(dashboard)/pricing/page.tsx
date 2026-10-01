import { listCurrentRates, listCurrencies } from "@/lib/currency";
import { listServices } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";
import PricingAdmin from "@/components/admin/PricingAdmin";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const [services, rates, currencies, priceHistory] = await Promise.all([
    listServices(false),
    listCurrentRates(),
    listCurrencies(false),
    prisma.servicePrice.findMany({
      orderBy: { effectiveFrom: "desc" },
      take: 25,
      include: { service: { select: { name: true } } },
    }),
  ]);

  return (
    <PricingAdmin
      services={services.map((s) => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        active: s.active,
        appliesGovernmentFee: s.appliesGovernmentFee,
        appliesQrFee: s.appliesQrFee,
        price: s.prices[0]
          ? {
              serviceFeeMinor: s.prices[0].serviceFeeMinor,
              vipSurchargeMinor: s.prices[0].vipSurchargeMinor,
              governmentFeeMinor: s.prices[0].governmentFeeMinor,
              qrFeeMinor: s.prices[0].qrFeeMinor,
              effectiveFrom: s.prices[0].effectiveFrom.toISOString(),
              createdByEmail: s.prices[0].createdByEmail,
            }
          : null,
      }))}
      rates={rates.map((r) => ({
        id: r.id,
        quoteCurrency: r.quoteCurrency,
        rate: Number(r.rate),
        mode: r.mode,
        source: r.source,
        effectiveFrom: r.effectiveFrom.toISOString(),
        createdByEmail: r.createdByEmail,
      }))}
      currencies={currencies.map((c) => ({ code: c.code, name: c.name, symbol: c.symbol, active: c.active }))}
      history={priceHistory.map((p) => ({
        id: p.id,
        service: p.service.name,
        serviceFeeMinor: p.serviceFeeMinor,
        vipSurchargeMinor: p.vipSurchargeMinor,
        governmentFeeMinor: p.governmentFeeMinor,
        qrFeeMinor: p.qrFeeMinor,
        effectiveFrom: p.effectiveFrom.toISOString(),
        effectiveTo: p.effectiveTo ? p.effectiveTo.toISOString() : null,
        createdByEmail: p.createdByEmail,
      }))}
    />
  );
}
