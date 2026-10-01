import { CtaBand } from "@/components/site/sections";
import { FadeIn } from "@/components/site/motion";
import { Container, PageHero, SectionHeader } from "@/components/site/ui";
import { JsonLdScript, breadcrumbJsonLd, pageMetadata, siteUrl } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Who We Are — Egypt Travel & Visa Assistance Since 2022",
  description:
    "MISR VISA is a Cairo-based travel support company founded by Fatima Muhammad Jidda, helping African travelers with Egypt visa on arrival, OK-to-Board, flights, hotels and airport pickup since 2022.",
  path: "/who-we-are",
  keywords: ["about Misr visa", "Fatima Muhammad Jidda", "Egypt travel company Cairo"],
});

const pillars = [
  ["Our mission", "To make traveling to Egypt simpler, clearer and more organized for African travelers through honest information and reliable travel assistance."],
  ["Our vision", "To become the most trusted travel-support brand connecting African travelers with Egypt through technology, information and reliable local partnerships."],
];

const values = [
  ["Honest information", "We tell you what applies to your trip — including when we can't help."],
  ["Speed that's real", "24–48h OK-to-Board with EgyptAir and Ethiopian Airlines, tracked step by step."],
  ["People who've done it", "Our team knows the journey to Cairo because we've made it ourselves."],
];

export default function WhoWeArePage() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${siteUrl}/who-we-are`,
    name: "Who We Are — MISR VISA",
    mainEntity: {
      "@id": `${siteUrl}/#organization`,
      foundingDate: "2022",
      founder: {
        "@type": "Person",
        "@id": "https://www.fatimamjidda.com/#person",
        name: "Fatima Muhammad Jidda",
        url: "https://www.fatimamjidda.com",
        jobTitle: "Founder",
        description: "Software engineering professional and entrepreneur who studied and lived in Egypt.",
      },
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript([aboutJsonLd, breadcrumbJsonLd([{ name: "Who We Are", path: "/who-we-are" }])])} />
      <PageHero
        eyebrow="Who we are"
        title={<>Egypt travel support, <span className="text-gold-gradient italic">built from experience</span>.</>}
        lead="MISR VISA helps African travelers prepare for their journey to Egypt — Visa on Arrival, OK-to-Board, flight tickets, accommodation and airport pickup."
      />
      <section className="py-16">
        <Container className="grid items-start gap-14 lg:grid-cols-2">
          <FadeIn>
            <SectionHeader align="left" eyebrow="Our story" title="How MISR VISA started" />
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ivory/70">
              <p>
                Our journey started in 2020, when our founder,{" "}
                <a href="https://www.fatimamjidda.com" className="text-gold underline underline-offset-4">Fatima Muhammad Jidda</a>, came to Egypt to study and
                experienced life in Egypt firsthand. Living and studying in Cairo showed us the challenges African travelers face when preparing to travel to Egypt.
              </p>
              <p>
                In 2022, MISR VISA was created to make that journey easier — practical guidance and reliable Egypt travel assistance, from OK-to-Board to the
                everyday details that decide whether a trip runs smoothly.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="gold-frame rounded-[32px] bg-white/[0.03] p-8 sm:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">About the founder</p>
            <p className="mt-6 font-display text-2xl leading-snug text-ivory sm:text-3xl">
              &ldquo;My experience as an African in Egypt inspired me to help other travelers feel confident before their journey.&rdquo;
            </p>
            <p className="mt-6 text-sm leading-relaxed text-ivory/60">
              Fatima is a software engineering professional and entrepreneur who studied and lived in Egypt.
            </p>
            <p className="mt-4 text-sm font-semibold text-ivory">Fatima Muhammad Jidda · Founder</p>
          </FadeIn>
        </Container>
      </section>
      <section className="py-16">
        <Container className="grid gap-6 md:grid-cols-2">
          {pillars.map(([t, b], i) => (
            <FadeIn key={t} delay={0.08 * i} className="rounded-[28px] border border-ivory/10 bg-white/[0.02] p-10">
              <h2 className="text-3xl text-gold-gradient">{t}</h2>
              <p className="mt-4 text-lg leading-relaxed text-ivory/70">{b}</p>
            </FadeIn>
          ))}
        </Container>
      </section>
      <section className="py-16">
        <Container className="grid gap-6 md:grid-cols-3">
          {values.map(([t, b], i) => (
            <FadeIn key={t} delay={0.08 * i} className="border-l border-gold/30 pl-6">
              <h3 className="font-sans text-lg font-semibold text-ivory">{t}</h3>
              <p className="mt-2 text-ivory/60">{b}</p>
            </FadeIn>
          ))}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
