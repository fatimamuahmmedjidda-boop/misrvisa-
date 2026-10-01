import Link from "next/link";
import PassportStory from "@/components/site/PassportStory";
import { CtaBand, FaqList, OkToBoardPriceNote } from "@/components/site/sections";
import { FadeIn, QrPattern, TiltCard } from "@/components/site/motion";
import { Arrow, Check, Container, GhostButton, GoldButton, PageHero, SectionHeader } from "@/components/site/ui";
import { FAQS, RECOMMENDED_AIRLINES, VISA_FEE } from "@/lib/content/site";
import { WHATSAPP_LINK } from "@/lib/content/social";
import { JsonLdScript, breadcrumbJsonLd, faqJsonLd, pageMetadata, siteUrl, visaHowToJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Egypt Visa on Arrival 2026: USD 36 QR Visa, Requirements & OK-to-Board",
  description:
    "Get your Egypt visa on arrival in 2026: USD 36 QR code visa at Cairo Airport (USD 30 + USD 6), passport and confirmed ticket, OK-to-Board in 24–48 hours with EgyptAir or Ethiopian Airlines.",
  path: "/visa-on-arrival",
  keywords: ["Egypt visa on arrival requirements", "Egypt visa on arrival for Nigerians", "Cairo airport visa fee", "Egypt entry visa"],
});

const faqs = FAQS.filter((f) => f.category !== "Partners");

export default function VisaOnArrivalPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Egypt Visa on Arrival & OK-to-Board Assistance",
    serviceType: "Travel visa assistance",
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: [{ "@type": "Country", name: "Egypt" }, { "@type": "Continent", name: "Africa" }],
    url: `${siteUrl}/visa-on-arrival`,
    description:
      "MISR VISA prepares African travelers for Egypt's visa on arrival: document checks, OK-to-Board in 24–48 hours with EgyptAir or Ethiopian Airlines, and arrival support at Cairo International Airport.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={JsonLdScript([serviceJsonLd, visaHowToJsonLd, faqJsonLd(faqs), breadcrumbJsonLd([{ name: "Egypt Visa on Arrival", path: "/visa-on-arrival" }])])}
      />
      <PageHero
        eyebrow="Egypt visa on arrival · 2026"
        title={
          <>
            Egypt Visa on Arrival: <span className="text-gold-gradient italic">USD 36</span>, a QR code, and you&rsquo;re in.
          </>
        }
        lead="Everything you need to know about the Egypt visa on arrival in 2026 — the new fee, the QR code visa at Cairo International Airport, the documents you need and how MISR VISA gets you OK-to-Board in 24–48 hours."
      >
        <GoldButton href="/apply?service=VISA_ON_ARRIVAL">
          Apply now <Arrow />
        </GoldButton>
        <GhostButton href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
          Ask on WhatsApp
        </GhostButton>
      </PageHero>

      {/* Quick answer box — written to be quoted by search engines and AI assistants */}
      <section className="pb-20">
        <Container>
          <FadeIn>
            <div className="gold-frame mx-auto max-w-4xl rounded-[28px] bg-white/[0.03] p-8 sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Quick answer</p>
              <p className="mt-4 text-lg leading-relaxed text-ivory/85 sm:text-xl">
                The <strong className="text-ivory">Egypt visa on arrival costs USD 36</strong> at Cairo International Airport — a USD 30 visa fee plus a USD 6
                service charge — and has been issued as a <strong className="text-ivory">digital QR code</strong> since {VISA_FEE.qrSince}. You need a passport
                valid for at least 6 months and a confirmed ticket. Many African travelers also need airline <strong className="text-ivory">OK-to-Board</strong>, which
                MISR VISA arranges in <strong className="text-ivory">24–48 hours</strong> for EgyptAir and Ethiopian Airlines passengers.
              </p>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Fee + QR */}
      <section className="py-20" aria-labelledby="fee-title">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <FadeIn>
            <SectionHeader
              align="left"
              eyebrow="The fee"
              title={<span id="fee-title">How much is the Egypt visa on arrival?</span>}
              lead={`Egypt raised the visa-on-arrival fee from USD 25 to USD 30 on ${VISA_FEE.feeRaisedOn}. At Cairo Airport, the QR code visa adds a USD 6 service charge, making USD 36 per traveler, paid by card.`}
            />
            <div className="mt-8 overflow-hidden rounded-2xl border border-ivory/10">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Egypt visa on arrival fee breakdown 2026</caption>
                <tbody className="divide-y divide-ivory/10">
                  {[
                    ["Visa fee (single entry)", `USD ${VISA_FEE.visaFee}`],
                    ["QR visa service charge", `USD ${VISA_FEE.serviceCharge}`],
                    ["Total at Cairo International Airport", `USD ${VISA_FEE.total}`],
                  ].map(([k, v], i) => (
                    <tr key={k} className={i === 2 ? "bg-gold/[0.08] font-semibold text-ivory" : "text-ivory/70"}>
                      <th scope="row" className="px-5 py-4 font-normal">{k}</th>
                      <td className="px-5 py-4 text-right">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-ivory/40">
              Fees are set by the Egyptian authorities and may change. The official portal is {VISA_FEE.officialSite}.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <TiltCard className="flex flex-col items-center p-10 text-center" max={14}>
              <div className="rounded-3xl bg-ivory p-5 shadow-2xl">
                <QrPattern className="h-48 w-48" />
              </div>
              <h3 className="mt-8 text-2xl text-ivory">The new QR code visa</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory/60">
                Since {VISA_FEE.qrSince}, Cairo Airport no longer glues a sticker in your passport. Your visa is a QR code — including when you connect onward to
                Hurghada, Sharm El Sheikh, Luxor or Aswan.
              </p>
            </TiltCard>
          </FadeIn>
        </Container>
      </section>

      {/* Requirements */}
      <section className="py-20" aria-labelledby="req-title">
        <Container>
          <FadeIn>
            <SectionHeader eyebrow="Requirements" title={<span id="req-title">Egypt visa on arrival requirements</span>} />
          </FadeIn>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Passport", "Valid for at least 6 months from arrival, with blank pages."],
              ["Confirmed ticket", "EgyptAir or Ethiopian Airlines recommended for the fastest OK-to-Board."],
              ["OK-to-Board", "Required by many airlines for African passports. We arrange it in 24–48h."],
              ["USD 36 by card", "For the QR visa at Cairo International Airport."],
            ].map(([t, b], i) => (
              <FadeIn key={t} delay={0.06 * i}>
                <div className="h-full rounded-[24px] border border-ivory/10 bg-white/[0.02] p-7">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-night-950">
                    <Check />
                  </span>
                  <h3 className="mt-5 font-sans text-lg font-semibold text-ivory">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/60">{b}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn>
            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-ivory/50">
              Immigration officers may also ask for a hotel booking, return ticket or proof of funds. Requirements depend on nationality and can change — MISR VISA
              confirms what applies to you before you pay.
            </p>
          </FadeIn>
        </Container>
      </section>

      <PassportStory />

      {/* Airlines */}
      <section className="py-24" aria-labelledby="okb-title">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <FadeIn>
            <SectionHeader
              align="left"
              eyebrow="OK-to-Board"
              title={<span id="okb-title">Why book EgyptAir or Ethiopian Airlines?</span>}
              lead="OK-to-Board is the airline's clearance to carry you to Egypt. Without it, you can be refused at check-in. With EgyptAir and Ethiopian Airlines our travelers are usually cleared in 24–48 hours — faster than any other airline we work with."
            />
            <Link href="/blog/ok-to-board-egypt-egyptair-ethiopian" className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold">
              Read the full OK-to-Board guide <Arrow />
            </Link>
            <OkToBoardPriceNote className="mt-8" />
          </FadeIn>
          <div className="grid gap-5 sm:grid-cols-2">
            {RECOMMENDED_AIRLINES.map((a, i) => (
              <FadeIn key={a.name} delay={0.1 * i}>
                <TiltCard className="p-8">
                  <p className="font-mono text-xs tracking-[0.3em] text-gold/70">{a.code}</p>
                  <h3 className="mt-3 text-3xl text-ivory">{a.name}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-ivory/60">{a.note}</p>
                  <p className="mt-6 inline-flex rounded-full bg-emerald-glow/15 px-3 py-1.5 text-xs font-semibold text-emerald-glow">OK-to-Board 24–48h</p>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24" aria-labelledby="faq-title">
        <Container className="max-w-4xl">
          <FadeIn>
            <SectionHeader eyebrow="FAQ" title={<span id="faq-title">Egypt visa on arrival — questions answered</span>} />
          </FadeIn>
          <FadeIn delay={0.1} className="mt-12">
            <FaqList items={faqs} />
          </FadeIn>
          <p className="mt-8 text-center text-xs leading-relaxed text-ivory/40">
            MISR VISA is a private company, not a government body. We do not issue visas; entry decisions are made by Egyptian immigration authorities.
          </p>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
