import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "MISR VISA has supported African travelers to Egypt since 2022 with honest, clear Visa-on-Arrival assistance and traveler support.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    title: "Honesty first",
    description:
      "We never guarantee visa approval or entry. We explain exactly what we do, what we don't, and what's decided by Egyptian immigration authorities.",
  },
  {
    title: "Egypt-focused",
    description: "Our work is focused entirely on Egypt — we know the journey and the practical details that matter.",
  },
  {
    title: "Real support",
    description: "From your first question to your arrival in Egypt, there's a real team behind every application.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-emerald py-20">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              About MISR VISA
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
              Supporting African travelers to Egypt since 2022
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70">
              MISR VISA is an Egypt-focused traveler support business. We help eligible African
              travelers understand and prepare for the Visa-on-Arrival process, and support the
              practical side of getting to Egypt — tickets, accommodation, airport pickup, and
              OK-to-Board guidance where applicable.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading align="left" eyebrow="Our story" title="Why we started" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/70">
              <p>
                MISR VISA started in 2022 to make traveling to Egypt clearer and less stressful
                for African travelers. Visa-on-Arrival processes, flight logistics, and finding
                reliable accommodation can be confusing from abroad — we built MISR VISA to close
                that gap with honest guidance and hands-on support.
              </p>
              <p>
                We support travelers coming to Egypt for tourism, medical treatment, study,
                family visits, and other legitimate travel purposes. What we don&rsquo;t do is
                just as important as what we do: we are not an embassy, we don&rsquo;t process
                e-Visas or embassy visas, and we never promise an outcome that isn&rsquo;t ours to
                promise.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <SectionHeading eyebrow="What guides us" title="Our values" />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <div className="h-full rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
                  <h3 className="font-display text-lg font-semibold text-emerald-dark">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">{v.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
