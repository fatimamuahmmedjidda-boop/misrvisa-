import PartnerForm from "@/components/PartnerForm";
import { FaqList } from "@/components/site/sections";
import { FadeIn, TiltCard } from "@/components/site/motion";
import { Arrow, Container, GhostButton, GoldButton, PageHero, PaperCard, SectionHeader } from "@/components/site/ui";
import { FAQS } from "@/lib/content/site";
import { JsonLdScript, breadcrumbJsonLd, faqJsonLd, pageMetadata, siteUrl } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Travel Agency Partnership Egypt: B2B Egypt Visa & OK-to-Board Partner Program",
  description:
    "Partner with MISR VISA: B2B Egypt visa-on-arrival and OK-to-Board support for travel agencies, tour operators, student recruiters and medical-travel facilitators. Commission for referring agents, business (B2B) prices and company contracts, agreed personally.",
  path: "/partner",
  keywords: [
    "travel agency partnership Egypt",
    "B2B Egypt visa",
    "Egypt visa agent",
    "become a travel agent partner",
    "Egypt DMC partner",
    "OK to board agent",
    "study in Egypt agent",
    "medical tourism Egypt partner",
  ],
});

const audiences = [
  ["Travel agencies & tour operators", "Package Egypt trips with OK-to-Board, hotels and transfers handled by our Cairo team."],
  ["Student recruitment agencies", "Get students to Egyptian universities on time, with pickup and accommodation."],
  ["Medical-travel facilitators", "Reliable arrivals for patients and companions, coordinated around appointment dates."],
  ["Corporate & event travel", "Business delegations, conferences and investor trips to Cairo and the New Capital."],
  ["Religious & cultural tour groups", "Group handling for heritage tours across Cairo, Luxor and Aswan."],
  ["Independent travel agents", "Earn commission referring travelers — no office or license in Egypt needed."],
];

const benefits = [
  ["Commission on every client", "Agents and partners earn commission from MISR VISA on every client they refer. Your rate is agreed personally with you."],
  ["Business (B2B) prices", "Agencies and companies get business prices, different from the prices for individual travelers."],
  ["Company contracts", "Companies can sign a partnership contract with MISR VISA, with terms tailored to their business."],
  ["Private partner dashboard", "See every referred client, their status and live tracking in one secure portal."],
  ["Your own referral code", "Clients apply with your code and are automatically linked to your account."],
  ["Direct WhatsApp line", "Talk to our Cairo team directly about quotes, documents and arrivals."],
  ["All services in one place", "OK-to-Board, flights, hotels and Cairo airport pickup for your travelers."],
];

const partnerFaqs = [
  { q: "Who can become a MISR VISA partner?", a: "Registered travel agencies, tour operators, independent travel agents, student recruiters, medical-travel facilitators and corporate travel managers serving travelers to Egypt." },
  { q: "How does commission work?", a: "Every agent or partner who refers clients to MISR VISA earns commission from us. Rates are different from partner to partner, so we agree yours personally when you contact us on WhatsApp or fill in the form below." },
  { q: "Do agencies and companies get different prices?", a: "Yes. Business customers — agencies and companies — receive business prices that are different from individual traveler prices. Companies can also sign a partnership contract. Prices and terms are agreed personally." },
  { q: "How do I start?", a: "Message us on WhatsApp or fill in the partner form. We contact you to discuss your business, and approved partners receive a partner dashboard and referral code." },
  { q: "Which countries do you work with?", a: "We work with partners across Africa — including Nigeria, Ghana, Sudan and Chad — and anywhere travelers are flying to Egypt." },
  ...FAQS.filter((f) => f.category === "Partners").map((f) => ({ q: f.q, a: f.a })),
];

export default function PartnerPage() {
  const programJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "MISR VISA B2B Partner Program",
    serviceType: "B2B travel visa assistance partnership",
    audience: { "@type": "BusinessAudience", audienceType: "Travel agencies, tour operators, student recruiters, medical-travel facilitators" },
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: { "@type": "Continent", name: "Africa" },
    url: `${siteUrl}/partner`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript([programJsonLd, faqJsonLd(partnerFaqs.map(({ q, a }) => ({ q, a, category: "Partners" }))), breadcrumbJsonLd([{ name: "Partner Program", path: "/partner" }])])} />
      <PageHero
        eyebrow="B2B partner program"
        title={<>Grow your agency with Egypt&rsquo;s <span className="text-gold-gradient italic">visa experts</span>.</>}
        lead="MISR VISA partners with travel agencies, tour operators and facilitators across Africa. You sell Egypt — we handle OK-to-Board, arrivals and everything in Cairo. You earn commission on every client you refer, at a rate agreed personally with you."
      >
        <GoldButton href="#apply">Become a partner <Arrow /></GoldButton>
        <GhostButton href="/partner-portal/login">Partner login</GhostButton>
      </PageHero>

      <section className="py-16">
        <Container>
          <FadeIn><SectionHeader eyebrow="Who we work with" title="Built for every business sending travelers to Egypt" /></FadeIn>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {audiences.map(([t, b], i) => (
              <FadeIn key={t} delay={0.05 * i}>
                <div className="h-full rounded-[24px] border border-ivory/10 bg-white/[0.02] p-7">
                  <h3 className="font-sans text-lg font-semibold text-ivory">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/60">{b}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <FadeIn><SectionHeader eyebrow="Partner benefits" title={<>Everything you need to <span className="text-gold-gradient italic">scale Egypt sales</span>.</>} /></FadeIn>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map(([t, b], i) => (
              <FadeIn key={t} delay={0.05 * i}>
                <TiltCard className="p-8" max={8}>
                  <span className="font-display text-3xl text-gold-gradient">0{i + 1}</span>
                  <h3 className="mt-4 font-sans text-lg font-semibold text-ivory">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/60">{b}</p>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section id="apply" className="scroll-mt-24 py-20">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <FadeIn>
            <SectionHeader align="left" eyebrow="Apply" title="Tell us about your business" lead="Our partnerships team reviews every application and contacts you to discuss partnership terms." />
            <div className="mt-10">
              <FaqList items={partnerFaqs} />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <PaperCard>
              <PartnerForm />
            </PaperCard>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
