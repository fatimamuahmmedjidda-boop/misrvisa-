import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import { getServiceBySlug, services } from "@/lib/content/services";

export function generateStaticParams() {
  return services
    .filter((s) => s.slug !== "visa-on-arrival")
    .map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.shortDescription,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;

  if (slug === "visa-on-arrival") {
    redirect("/visa-on-arrival");
  }

  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <section className="bg-emerald py-16">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Link href="/services" className="text-xs font-semibold uppercase tracking-wide text-gold">
            &larr; All Services
          </Link>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
            {service.name}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70">
            {service.shortDescription}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-5xl gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <h2 className="font-display text-xl font-semibold text-emerald-dark">What it is</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">{service.whatItIs}</p>

            <h2 className="mt-8 font-display text-xl font-semibold text-emerald-dark">
              Who it&rsquo;s for
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">{service.whoItsFor}</p>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-2xl border border-black/5 bg-ivory p-7">
              <h2 className="font-display text-lg font-semibold text-emerald-dark">
                What MISR VISA helps with
              </h2>
              <ul className="mt-4 space-y-2.5">
                {service.whatWeHelpWith.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink/70">
                    <span className="mt-1 text-gold-dark">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-2xl border border-black/5 bg-white p-7">
              <h2 className="font-display text-lg font-semibold text-emerald-dark">
                What you need
              </h2>
              <ul className="mt-4 space-y-2.5">
                {service.whatYouNeed.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink/70">
                    <span className="mt-1 text-gold-dark">&#8226;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-16">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <h2 className="text-center font-display text-2xl font-semibold text-emerald-dark">
            What happens next
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.whatHappensNext.map((step, i) => (
              <Reveal key={step} delay={i * 80}>
                <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                  <span className="font-display text-2xl font-semibold text-gold-dark">
                    {i + 1}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{step}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={`Ready to get started with ${service.name}?`}
        description="Contact us for current pricing and submit your application to receive a tracking number."
      />
    </>
  );
}
