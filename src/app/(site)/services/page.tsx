import Link from "next/link";
import { CtaBand } from "@/components/site/sections";
import { FadeIn, TiltCard } from "@/components/site/motion";
import { Arrow, PageHero, Container } from "@/components/site/ui";
import { services } from "@/lib/content/services";
import { JsonLdScript, breadcrumbJsonLd, pageMetadata, siteUrl } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Egypt Travel Services: Visa on Arrival, OK-to-Board, Flights, Hotels & Airport Pickup",
  description:
    "MISR VISA services for travelers to Egypt: visa-on-arrival assistance, OK-to-Board in 24–48 hours, EgyptAir and Ethiopian Airlines tickets, Cairo hotels and Cairo airport pickup.",
  path: "/services",
  keywords: ["Egypt travel agency", "Cairo airport pickup", "Egypt hotel booking", "EgyptAir tickets Nigeria"],
});

export default function ServicesPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteUrl}${s.slug === "visa-on-arrival" ? "/visa-on-arrival" : `/services/${s.slug}`}`,
      name: s.name,
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript([itemList, breadcrumbJsonLd([{ name: "Services", path: "/services" }])])} />
      <PageHero
        eyebrow="Services"
        title={<>Premium travel support, <span className="text-gold-gradient italic">door to door</span>.</>}
        lead="Choose one service or let us handle the whole journey — from OK-to-Board to the car waiting at Cairo Airport."
      />
      <section className="pb-12">
        <Container className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <FadeIn key={s.slug} delay={0.06 * i}>
              <TiltCard className="p-8">
                <Link href={s.slug === "visa-on-arrival" ? "/visa-on-arrival" : `/services/${s.slug}`} className="group flex h-full flex-col">
                  <span className="font-mono text-xs tracking-[0.3em] text-gold/60">0{i + 1}</span>
                  <h2 className="mt-4 text-2xl text-ivory">{s.name}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/60">{s.shortDescription}</p>
                  <span className="mt-auto flex items-center gap-2 pt-8 text-sm font-semibold text-gold">Explore <Arrow /></span>
                </Link>
              </TiltCard>
            </FadeIn>
          ))}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
