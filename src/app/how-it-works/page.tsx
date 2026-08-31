import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "How Egypt Visa-on-Arrival Assistance Works",
  description: "How the MISR VISA application process works, from submitting your details to arriving in Egypt.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  {
    title: "Choose your service",
    description:
      "Select Visa-on-Arrival assistance, ticket assistance, accommodation, airport pickup, or OK-to-Board support on our Apply page.",
  },
  {
    title: "Submit your details",
    description:
      "Share your full name, nationality, contact details, travel date, and travel purpose. We only collect what's genuinely necessary.",
  },
  {
    title: "Receive your tracking number",
    description:
      "Every application gets a unique MISR VISA tracking number (e.g. MVR-2026-0001) immediately after submission.",
  },
  {
    title: "Our team reviews your application",
    description:
      "We review your travel details and reach out by WhatsApp or email with guidance and next steps.",
  },
  {
    title: "Track your status anytime",
    description:
      "Use your tracking number on our Track Application page to see where things stand — Received, Under Review, Documents Required, Processing, Ready, or Completed.",
  },
  {
    title: "Travel with support",
    description:
      "We stay with you through preparation, right up to your arrival in Egypt.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="bg-emerald py-16">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Process
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
            How It Works
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70">
            A clear, honest process from application to arrival.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <SectionHeading eyebrow="Step by step" title="From application to arrival" />
          <ol className="mt-14 space-y-10">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 60}>
                <li className="flex gap-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald font-display text-lg font-semibold text-gold">
                    {i + 1}
                  </div>
                  <div className="pt-1.5">
                    <h3 className="font-display text-lg font-semibold text-emerald-dark">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/65">{step.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CTASection />
    </>
  );
}
