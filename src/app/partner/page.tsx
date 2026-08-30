import type { Metadata } from "next";
import PartnerForm from "@/components/PartnerForm";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Partner With Us",
  description:
    "Travel agencies, medical facilitators, study-abroad agencies, and corporate partners can work with MISR VISA on Egypt Visa-on-Arrival support, OK-to-Board, accommodation, and airport pickup.",
  alternates: { canonical: "/partner" },
};

const audiences = [
  "Travel agencies",
  "Travel agents",
  "Medical facilitators",
  "Study-abroad agencies",
  "Corporate partners",
  "Other legitimate organizations",
];

export default function PartnerPage() {
  return (
    <>
      <section className="bg-emerald py-16">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Partnerships
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
            Partner With MISR VISA
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70">
            We support partners who need help with Egypt Visa-on-Arrival guidance, OK-to-Board,
            accommodation, airport pickup, and related traveler support for the people they serve.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-5 lg:grid lg:grid-cols-5 lg:gap-12 lg:px-8">
          <div className="lg:col-span-2">
            <Reveal>
              <h2 className="font-display text-xl font-semibold text-emerald-dark">
                Who we work with
              </h2>
              <ul className="mt-5 space-y-3">
                {audiences.map((a) => (
                  <li key={a} className="flex items-center gap-2.5 text-sm text-ink/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-dark" />
                    {a}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm leading-relaxed text-ink/65">
                Tell us about your organization and the travelers you serve. Our team will follow
                up to discuss how MISR VISA can support your clients traveling to Egypt.
              </p>
            </Reveal>
          </div>
          <div className="mt-12 lg:col-span-3 lg:mt-0">
            <PartnerForm />
          </div>
        </div>
      </section>
    </>
  );
}
