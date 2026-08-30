import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const faqs: { question: string; answer: string; category: string; sortOrder: number }[] = [
  {
    category: "Visa-on-Arrival",
    sortOrder: 1,
    question: "What is Visa-on-Arrival?",
    answer:
      "Visa-on-Arrival is an entry option available to eligible travelers at Egyptian ports of entry, issued on arrival rather than in advance. MISR VISA assists eligible African travelers in preparing for this process. We do not control immigration decisions, and entry is never guaranteed — it is decided solely by Egyptian immigration authorities.",
  },
  {
    category: "Visa-on-Arrival",
    sortOrder: 2,
    question: "Who may be eligible?",
    answer:
      "Eligibility depends on your nationality and current Egyptian immigration policy, which can change. Tell us your nationality and travel plans and our team will let you know how we can help. We do not invent or guess eligibility rules — anything time-sensitive is flagged for verification.",
  },
  {
    category: "Visa-on-Arrival",
    sortOrder: 3,
    question: "What documents are required?",
    answer:
      "Typically a valid passport with sufficient remaining validity and your travel details. Requirements can vary by nationality and change over time, so our team will confirm exactly what applies to your situation before you travel.",
  },
  {
    category: "Visa-on-Arrival",
    sortOrder: 4,
    question: "How does the process work?",
    answer:
      "You submit an application through our website, we review your travel details and reach out with guidance, and we support you through preparation up to your arrival in Egypt. See our How It Works page for the full step-by-step flow.",
  },
  {
    category: "Pricing",
    sortOrder: 5,
    question: "How much does it cost?",
    answer: "Contact us for current pricing — costs depend on the service and your specific travel plans.",
  },
  {
    category: "Visa-on-Arrival",
    sortOrder: 6,
    question: "Where is the visa obtained?",
    answer:
      "Visa-on-Arrival is issued at the Egyptian port of entry (airport) for eligible travelers, not at an embassy in advance.",
  },
  {
    category: "OK-to-Board",
    sortOrder: 7,
    question: "What is OK-to-Board?",
    answer:
      "OK-to-Board is a confirmation some airlines require before allowing a passenger to board a flight, for certain nationalities or routes. MISR VISA supports eligible travelers with this process where applicable — it does not apply to every route or airline.",
  },
  {
    category: "Services",
    sortOrder: 8,
    question: "Does MISR VISA provide e-Visa services?",
    answer:
      "No. MISR VISA focuses on Visa-on-Arrival assistance. We do not process e-Visas or embassy visas.",
  },
  {
    category: "Services",
    sortOrder: 9,
    question: "Does MISR VISA process embassy visas?",
    answer: "No. MISR VISA is not an embassy and does not process embassy visa applications.",
  },
  {
    category: "Services",
    sortOrder: 10,
    question: "Can MISR VISA help with accommodation?",
    answer:
      "Yes. We help travelers arrange accommodation in Egypt suited to their travel purpose and budget. See our Accommodation Assistance service for details.",
  },
  {
    category: "Services",
    sortOrder: 11,
    question: "Can MISR VISA arrange airport pickup?",
    answer:
      "Yes. We can arrange pickup timed to your flight arrival and coordinate transport to your accommodation.",
  },
  {
    category: "Services",
    sortOrder: 12,
    question: "Can I request ticket assistance?",
    answer:
      "Yes. We can help with flight guidance so your travel dates line up with your visa and accommodation plans.",
  },
  {
    category: "Tracking",
    sortOrder: 13,
    question: "How can I track my application?",
    answer:
      "Every application receives a unique tracking number (e.g. MVR-2026-0001) shown on your confirmation. Enter it on our Track Application page any time to see its current status.",
  },
];

async function main() {
  console.log("Seeding FAQ...");
  for (const faq of faqs) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.faq.create({ data: faq });
    }
  }

  console.log("Seeding placeholder testimonials...");
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        { isPlaceholder: true, published: false },
        { isPlaceholder: true, published: false },
        { isPlaceholder: true, published: false },
      ],
    });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
    if (!existingAdmin) {
      console.log(`Creating admin user ${adminEmail}...`);
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await prisma.adminUser.create({
        data: {
          email: adminEmail,
          passwordHash,
          name: "MISR VISA Admin",
        },
      });
    }
  } else {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user creation.");
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
