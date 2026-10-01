/**
 * Seeds the INITIAL business values supplied by the owner. Everything written
 * here is editable afterwards from Admin → Pricing & Currencies; none of it is
 * a permanent fact.
 *
 *   npx tsx prisma/seed-pricing.ts
 *
 * Re-running is safe: currencies and services are upserted, and a price or rate
 * is only published when none is currently in force.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", minorUnits: 2, isBase: true, sortOrder: 0 },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", minorUnits: 2, isBase: false, sortOrder: 1 },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£", minorUnits: 2, isBase: false, sortOrder: 2 },
  { code: "XAF", name: "Central African CFA Franc", symbol: "FCFA", minorUnits: 0, isBase: false, sortOrder: 3 },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "GH₵", minorUnits: 2, isBase: false, sortOrder: 4 },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh", minorUnits: 2, isBase: false, sortOrder: 5 },
];

// Owner-provided starting values (USD, major units).
const INITIAL = {
  governmentArrivalFee: 30,
  qrCodeFee: 6,
  visaOnArrivalService: 150,
  // Display rate only — 1 USD ≈ NGN 1,391 at the time of seeding.
  ngnRate: 1391,
};

const SERVICES = [
  {
    slug: "visa-on-arrival",
    dbValue: "VISA_ON_ARRIVAL",
    name: "Egypt Visa-on-Arrival Assistance",
    description: "Preparation and support for Egypt's visa on arrival, including OK-to-Board where required.",
    appliesGovernmentFee: true,
    appliesQrFee: true,
    sortOrder: 1,
    serviceFee: INITIAL.visaOnArrivalService,
  },
  {
    slug: "ok-to-board",
    dbValue: "OK_TO_BOARD",
    name: "OK-to-Board Support",
    description: "Airline OK-to-Board clearance. Price varies daily by nationality and airline.",
    appliesGovernmentFee: false,
    appliesQrFee: false,
    sortOrder: 2,
    serviceFee: 0,
  },
  { slug: "ticket-assistance", dbValue: "TICKET_ASSISTANCE", name: "Ticket / Flight Assistance", description: null, appliesGovernmentFee: false, appliesQrFee: false, sortOrder: 3, serviceFee: 0 },
  { slug: "accommodation", dbValue: "ACCOMMODATION", name: "Accommodation Assistance", description: null, appliesGovernmentFee: false, appliesQrFee: false, sortOrder: 4, serviceFee: 0 },
  { slug: "airport-pickup", dbValue: "AIRPORT_PICKUP", name: "Airport Pickup", description: null, appliesGovernmentFee: false, appliesQrFee: false, sortOrder: 5, serviceFee: 0 },
];

const usd = (major: number) => Math.round(major * 100);

async function main() {
  for (const c of CURRENCIES) {
    await prisma.currency.upsert({ where: { code: c.code }, update: c, create: c });
  }
  console.log(`Currencies ready: ${CURRENCIES.map((c) => c.code).join(", ")}`);

  for (const s of SERVICES) {
    const service = await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        description: s.description,
        dbValue: s.dbValue,
        appliesGovernmentFee: s.appliesGovernmentFee,
        appliesQrFee: s.appliesQrFee,
        sortOrder: s.sortOrder,
      },
      create: {
        slug: s.slug,
        name: s.name,
        description: s.description,
        dbValue: s.dbValue,
        appliesGovernmentFee: s.appliesGovernmentFee,
        appliesQrFee: s.appliesQrFee,
        sortOrder: s.sortOrder,
      },
    });

    const current = await prisma.servicePrice.findFirst({ where: { serviceId: service.id, effectiveTo: null } });
    if (current) {
      console.log(`Price already set for ${s.slug} — left unchanged.`);
      continue;
    }

    await prisma.servicePrice.create({
      data: {
        serviceId: service.id,
        currency: "USD",
        serviceFeeMinor: usd(s.serviceFee),
        vipSurchargeMinor: 0,
        governmentFeeMinor: s.appliesGovernmentFee ? usd(INITIAL.governmentArrivalFee) : 0,
        qrFeeMinor: s.appliesQrFee ? usd(INITIAL.qrCodeFee) : 0,
        note: "Initial value seeded from owner instructions — editable in Admin.",
        createdByEmail: "seed",
      },
    });
    console.log(`Initial price published for ${s.slug}.`);
  }

  const ngn = await prisma.exchangeRate.findFirst({ where: { baseCurrency: "USD", quoteCurrency: "NGN", effectiveTo: null } });
  if (ngn) {
    console.log("NGN rate already configured — left unchanged.");
  } else {
    await prisma.exchangeRate.create({
      data: {
        baseCurrency: "USD",
        quoteCurrency: "NGN",
        rate: INITIAL.ngnRate.toFixed(6),
        mode: "MANUAL",
        source: "Owner-provided display rate at setup",
        createdByEmail: "seed",
      },
    });
    console.log(`Initial display rate published: 1 USD = ${INITIAL.ngnRate} NGN.`);
  }

  console.log("\nAll of these values are now editable in Admin → Pricing & Currencies.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
