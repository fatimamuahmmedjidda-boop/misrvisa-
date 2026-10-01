import { CtaBand, FaqList } from "@/components/site/sections";
import { FadeIn } from "@/components/site/motion";
import { Container, PageHero } from "@/components/site/ui";
import { FAQS } from "@/lib/content/site";
import { JsonLdScript, breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Egypt Visa FAQ 2026: Fees, QR Visa, OK-to-Board & Requirements",
  description:
    "Answers to the most asked Egypt visa questions in 2026: the USD 36 visa on arrival, QR code visa at Cairo Airport, OK-to-Board timing, best airlines, tracking and partnerships.",
  path: "/faq",
  keywords: ["Egypt visa FAQ", "Egypt visa questions", "Egypt visa cost 2026"],
});

export default function FAQPage() {
  const categories = Array.from(new Set(FAQS.map((f) => f.category)));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript([faqJsonLd(), breadcrumbJsonLd([{ name: "FAQ", path: "/faq" }])])} />
      <PageHero eyebrow="FAQ" title={<>Egypt visa questions, <span className="text-gold-gradient italic">answered</span>.</>} lead="Straight answers, updated for 2026." />
      <section className="pb-12">
        <Container className="max-w-4xl space-y-14">
          {categories.map((c) => (
            <FadeIn key={c}>
              <h2 className="mb-6 text-2xl text-gold-light">{c}</h2>
              <FaqList items={FAQS.filter((f) => f.category === c)} />
            </FadeIn>
          ))}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
