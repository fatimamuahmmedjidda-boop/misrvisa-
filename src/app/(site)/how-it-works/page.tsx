import { CtaBand } from "@/components/site/sections";
import PassportStory from "@/components/site/PassportStory";
import { FadeIn } from "@/components/site/motion";
import { Arrow, Container, GoldButton, PageHero, SectionHeader } from "@/components/site/ui";
import { JOURNEY_STEPS } from "@/lib/content/site";
import { JsonLdScript, breadcrumbJsonLd, pageMetadata, visaHowToJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "How to Get an Egypt Visa on Arrival: Step-by-Step with OK-to-Board",
  description:
    "How the MISR VISA process works: send your passport and EgyptAir or Ethiopian Airlines ticket, get OK-to-Board in 24–48 hours, fly to Cairo and receive the USD 36 QR visa on arrival.",
  path: "/how-it-works",
  keywords: ["how to apply Egypt visa", "Egypt visa process", "Egypt visa steps"],
});

const after = [
  ["Tracking number instantly", "The moment you apply you receive a MISR VISA tracking number (e.g. MVR-2026-0001)."],
  ["A real person in Cairo", "A named team member reviews your documents and messages you on WhatsApp."],
  ["Documents requested only if needed", "If anything is missing, your status changes to Documents Required with clear instructions."],
  ["Ready before you fly", "Once OK-to-Board is confirmed, your status becomes Ready — and we confirm pickup and hotel."],
];

export default function HowItWorksPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript([visaHowToJsonLd, breadcrumbJsonLd([{ name: "How It Works", path: "/how-it-works" }])])} />
      <PageHero
        eyebrow="How it works"
        title={<>Four steps from your city to <span className="text-gold-gradient italic">Cairo</span>.</>}
        lead="A clear, tracked process built for African travelers — no embassy visits, no guesswork."
      >
        <GoldButton href="/apply">Start step one <Arrow /></GoldButton>
      </PageHero>

      <section className="pb-12">
        <Container>
          <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {JOURNEY_STEPS.map((s, i) => (
              <li key={s.n}>
                <FadeIn delay={0.08 * i} className="gold-frame h-full rounded-[26px] bg-white/[0.02] p-7">
                  <span className="font-display text-5xl text-gold-gradient">{s.n}</span>
                  <h2 className="mt-5 font-sans text-lg font-semibold text-ivory">{s.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/60">{s.body}</p>
                </FadeIn>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <PassportStory />

      <section className="py-24">
        <Container>
          <FadeIn>
            <SectionHeader eyebrow="After you apply" title="What happens behind the scenes" />
          </FadeIn>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {after.map(([t, b], i) => (
              <FadeIn key={t} delay={0.06 * i}>
                <div className="flex h-full gap-5 rounded-[24px] border border-ivory/10 bg-white/[0.02] p-7">
                  <span className="mt-1 h-3 w-3 shrink-0 rotate-45 bg-gold" />
                  <div>
                    <h3 className="font-sans text-lg font-semibold text-ivory">{t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ivory/60">{b}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
