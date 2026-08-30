import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import FAQAccordion from "@/components/FAQAccordion";
import CTASection from "@/components/CTASection";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about Egypt Visa-on-Arrival, OK-to-Board, pricing, and how MISR VISA's application process works.",
  alternates: { canonical: "/faq" },
};

export default async function FAQPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });

  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-emerald py-16">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">FAQ</span>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          {categories.length === 0 && (
            <p className="text-center text-sm text-ink/60">FAQs coming soon.</p>
          )}
          <div className="space-y-14">
            {categories.map((category) => {
              const items = faqs.filter((f) => f.category === category);
              return (
                <div key={category}>
                  <SectionHeading align="left" title={category} />
                  <div className="mt-6">
                    <FAQAccordion
                      items={items.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection
        title="Still have questions?"
        description="Reach out and our team will get back to you directly."
      />
    </>
  );
}
