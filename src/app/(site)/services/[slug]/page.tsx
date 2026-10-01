import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CtaBand } from "@/components/site/sections";
import { FadeIn } from "@/components/site/motion";
import { Arrow, Check, Container, GoldButton, PageHero } from "@/components/site/ui";
import { getServiceBySlug, services } from "@/lib/content/services";
import { JsonLdScript, breadcrumbJsonLd, pageMetadata, siteUrl } from "@/lib/seo";

const seo: Record<string, { title: string; keywords: string[] }> = {
  "ok-to-board": { title: "OK-to-Board for Egypt in 24–48 Hours (EgyptAir & Ethiopian Airlines)", keywords: ["OK to board Egypt", "OKTB Egypt", "EgyptAir OK to board"] },
  "ticket-assistance": { title: "Flights to Cairo: EgyptAir & Ethiopian Airlines Ticket Assistance", keywords: ["flights to Cairo", "EgyptAir ticket", "Ethiopian Airlines Cairo"] },
  accommodation: { title: "Hotels in Cairo & Egypt: Accommodation Booking Assistance", keywords: ["hotels in Cairo", "Egypt accommodation", "Cairo apartment"] },
  "airport-pickup": { title: "Cairo Airport Pickup: Meet & Greet Transfer Service", keywords: ["Cairo airport pickup", "Cairo airport transfer", "Egypt airport pickup"] },
};

export function generateStaticParams() {
  return services.filter((s) => s.slug !== "visa-on-arrival").map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return pageMetadata({
    title: seo[slug]?.title ?? `${service.name} for Egypt Travel`,
    description: `${service.shortDescription} MISR VISA supports African travelers to Egypt with OK-to-Board in 24–48 hours.`,
    path: `/services/${service.slug}`,
    keywords: seo[slug]?.keywords,
  });
}

export default async function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  if (slug === "visa-on-arrival") redirect("/visa-on-arrival");
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.whatItIs,
    serviceType: service.name,
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: { "@type": "Country", name: "Egypt" },
    url: `${siteUrl}/services/${service.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript([serviceJsonLd, breadcrumbJsonLd([{ name: "Services", path: "/services" }, { name: service.name, path: `/services/${service.slug}` }])])} />
      <PageHero eyebrow="Service" title={service.name} lead={service.shortDescription}>
        <GoldButton href={`/apply?service=${service.dbValue}`}>Apply for this service <Arrow /></GoldButton>
      </PageHero>

      <section className="pb-16">
        <Container className="grid gap-6 lg:grid-cols-2">
          <FadeIn className="rounded-[28px] border border-ivory/10 bg-white/[0.02] p-8 sm:p-10">
            <h2 className="text-2xl text-ivory">What it is</h2>
            <p className="mt-4 leading-relaxed text-ivory/65">{service.whatItIs}</p>
            <h2 className="mt-10 text-2xl text-ivory">Who it&rsquo;s for</h2>
            <p className="mt-4 leading-relaxed text-ivory/65">{service.whoItsFor}</p>
          </FadeIn>
          <FadeIn delay={0.1} className="gold-frame rounded-[28px] bg-white/[0.03] p-8 sm:p-10">
            <h2 className="text-2xl text-ivory">What MISR VISA helps with</h2>
            <ul className="mt-5 space-y-3">
              {service.whatWeHelpWith.map((item) => (
                <li key={item} className="flex gap-3 text-ivory/75"><Check className="mt-1 h-4 w-4 shrink-0 text-gold" />{item}</li>
              ))}
            </ul>
            <h2 className="mt-10 text-2xl text-ivory">What you need</h2>
            <ul className="mt-5 space-y-3">
              {service.whatYouNeed.map((item) => (
                <li key={item} className="flex gap-3 text-ivory/75"><span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-gold/70" />{item}</li>
              ))}
            </ul>
          </FadeIn>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="text-center text-3xl text-ivory sm:text-4xl">What happens next</h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {service.whatHappensNext.map((step, i) => (
              <li key={step}>
                <FadeIn delay={0.08 * i} className="h-full rounded-[24px] border border-ivory/10 bg-white/[0.02] p-7">
                  <span className="font-display text-4xl text-gold-gradient">0{i + 1}</span>
                  <p className="mt-4 text-ivory/75">{step}</p>
                </FadeIn>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-center text-sm text-ivory/50">
            Travelling to Egypt? Read the <Link href="/visa-on-arrival" className="text-gold underline underline-offset-4">Egypt visa on arrival guide</Link>.
          </p>
        </Container>
      </section>
      <CtaBand title={`Ready for ${service.name}?`} lead="Submit your details to get a tracking number and a clear quote from our Cairo team." />
    </>
  );
}
