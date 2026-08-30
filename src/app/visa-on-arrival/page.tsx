import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import { getServiceBySlug } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Egypt Visa-on-Arrival Assistance",
  description:
    "MISR VISA helps eligible African travelers prepare for Egypt's Visa-on-Arrival process — clear guidance, honest information, and real support.",
  alternates: { canonical: "/visa-on-arrival" },
};

const service = getServiceBySlug("visa-on-arrival")!;

const distinctions = [
  {
    title: "Visa-on-Arrival",
    description: "Issued at the Egyptian port of entry for eligible travelers. This is what MISR VISA assists with.",
    highlight: true,
  },
  {
    title: "e-Visa",
    description: "Applied for online in advance and issued before travel. MISR VISA does not process e-Visas.",
    highlight: false,
  },
  {
    title: "Embassy Visa",
    description: "Processed through an Egyptian embassy or consulate. MISR VISA is not an embassy and does not process these.",
    highlight: false,
  },
];

export default function VisaOnArrivalPage() {
  return (
    <>
      <section className="bg-emerald py-20">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Flagship Service
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
              Egypt Visa-on-Arrival Assistance
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70">
              {service.whatItIs}
            </p>
            <div className="mt-9 flex justify-center">
              <Button href="/apply" variant="gold">
                Apply Now
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Clarity section: VoA vs e-Visa vs embassy */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <h2 className="text-center font-display text-2xl font-semibold text-emerald-dark sm:text-3xl">
            Know the difference
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-ink/65">
            Egypt entry options are often confused with one another. Here&rsquo;s exactly where
            MISR VISA fits in.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {distinctions.map((d, i) => (
              <Reveal key={d.title} delay={i * 100}>
                <div
                  className={`h-full rounded-2xl p-7 ${
                    d.highlight
                      ? "border-2 border-gold bg-white shadow-lg"
                      : "border border-black/5 bg-ivory"
                  }`}
                >
                  {d.highlight && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-gold-dark">
                      We assist with this
                    </span>
                  )}
                  <h3 className="mt-2 font-display text-lg font-semibold text-emerald-dark">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{d.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for / what we help with */}
      <section className="bg-ivory py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 sm:grid-cols-2 lg:px-8">
          <Reveal>
            <h2 className="font-display text-xl font-semibold text-emerald-dark">
              Who it&rsquo;s for
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">{service.whoItsFor}</p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-xl font-semibold text-emerald-dark">
              What we help with
            </h2>
            <ul className="mt-3 space-y-2.5">
              {service.whatWeHelpWith.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink/70">
                  <span className="mt-1 text-gold-dark">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <h2 className="text-center font-display text-2xl font-semibold text-emerald-dark sm:text-3xl">
            What happens next
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.whatHappensNext.map((step, i) => (
              <Reveal key={step} delay={i * 80}>
                <div className="rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm">
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

      <div className="mx-auto max-w-3xl px-5 pb-16 lg:px-8">
        <div className="rounded-2xl border border-emerald/10 bg-emerald/5 p-6 text-center text-sm leading-relaxed text-emerald-dark">
          Eligibility and requirements depend on nationality and current Egyptian immigration
          policy, which can change. MISR VISA does not guarantee visa approval or entry — final
          decisions are made solely by Egyptian immigration authorities.
        </div>
      </div>

      <CTASection
        title="Ready to start your Visa-on-Arrival application?"
        description="Contact us for current pricing and submit your details to get your tracking number."
      />
    </>
  );
}
