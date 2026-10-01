import { prisma } from "@/lib/prisma";
import { convertMinor } from "@/lib/money";

export const BASE_CURRENCY = "USD";

export interface RateSnapshot {
  id: string | null;
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  mode: string;
  source: string | null;
  updatedAt: Date | null;
  updatedByEmail: string | null;
}

export async function listCurrencies(activeOnly = true) {
  return prisma.currency.findMany({
    where: activeOnly ? { active: true } : undefined,
    orderBy: [{ sortOrder: "asc" }, { code: "asc" }],
  });
}

/** The rate currently in force. Only the database decides the official rate. */
export async function getCurrentRate(quoteCurrency: string, baseCurrency = BASE_CURRENCY): Promise<RateSnapshot | null> {
  if (quoteCurrency === baseCurrency) {
    return {
      id: null,
      baseCurrency,
      quoteCurrency,
      rate: 1,
      mode: "BASE",
      source: null,
      updatedAt: null,
      updatedByEmail: null,
    };
  }

  const row = await prisma.exchangeRate.findFirst({
    where: { baseCurrency, quoteCurrency, effectiveTo: null },
    orderBy: { effectiveFrom: "desc" },
  });
  if (!row) return null;

  return {
    id: row.id,
    baseCurrency: row.baseCurrency,
    quoteCurrency: row.quoteCurrency,
    rate: Number(row.rate),
    mode: row.mode,
    source: row.source,
    updatedAt: row.effectiveFrom,
    updatedByEmail: row.createdByEmail,
  };
}

export async function listCurrentRates(baseCurrency = BASE_CURRENCY) {
  return prisma.exchangeRate.findMany({
    where: { baseCurrency, effectiveTo: null },
    orderBy: { quoteCurrency: "asc" },
  });
}

export async function getRateHistory(quoteCurrency: string, baseCurrency = BASE_CURRENCY, take = 20) {
  return prisma.exchangeRate.findMany({
    where: { baseCurrency, quoteCurrency },
    orderBy: { effectiveFrom: "desc" },
    take,
  });
}

/**
 * Publishes a new rate: the previous one is closed (never edited), so every
 * historical invoice can still be explained by the rate that was in force.
 */
export async function publishRate(params: {
  quoteCurrency: string;
  rate: number;
  mode?: string;
  source?: string | null;
  baseCurrency?: string;
  actor: { id?: string | null; email?: string | null };
}) {
  const baseCurrency = params.baseCurrency ?? BASE_CURRENCY;
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    await tx.exchangeRate.updateMany({
      where: { baseCurrency, quoteCurrency: params.quoteCurrency, effectiveTo: null },
      data: { effectiveTo: now },
    });
    return tx.exchangeRate.create({
      data: {
        baseCurrency,
        quoteCurrency: params.quoteCurrency,
        rate: params.rate.toFixed(6),
        mode: params.mode ?? "MANUAL",
        source: params.source ?? null,
        effectiveFrom: now,
        createdById: params.actor.id ?? null,
        createdByEmail: params.actor.email ?? null,
      },
    });
  });
}

/** Display-only conversion of a USD amount, always labelled as an estimate in the UI. */
export async function convertFromUsd(usdMinor: number, quoteCurrency: string) {
  const [rate, currency] = await Promise.all([
    getCurrentRate(quoteCurrency),
    prisma.currency.findUnique({ where: { code: quoteCurrency } }),
  ]);
  if (!rate || !currency) return null;
  return {
    currency: currency.code,
    symbol: currency.symbol,
    minorUnits: currency.minorUnits,
    rate: rate.rate,
    rateId: rate.id,
    amountMinor: convertMinor(usdMinor, rate.rate, currency.minorUnits),
  };
}

/** Suggestion only — an explicit customer choice always wins. */
export const COUNTRY_CURRENCY_SUGGESTIONS: Record<string, string> = {
  NG: "NGN",
  EG: "EGP",
  TD: "XAF",
  CM: "XAF",
  GH: "GHS",
  KE: "KES",
};
