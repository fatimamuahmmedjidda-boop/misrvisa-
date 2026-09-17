import type { Metadata } from "next";
import CTASection from "@/components/CTASection";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "Who We Are — Egypt Travel & Visa Assistance Since 2022",
  description:
    "MISR VISA is an Egypt-focused travel support brand helping African travelers with Egypt Visa on Arrival, flight tickets, accommodation, Egypt airport pickup, and OK-to-Board support.",
  alternates: { canonical: "/who-we-are" },
  openGraph: {
    title: "Who We Are — MISR VISA",
    description:
      "An Egypt-focused travel support brand helping African travelers prepare for their journey to Egypt.",
    url: "/who-we-are",
  },
};

const pillars = [
  {
    title: "Our Mission",
    body: "To make traveling to Egypt simpler, clearer, and more organized for African travelers through honest information and reliable travel assistance.",
  },
  {
    title: "Our Vision",
    body: "To become a trusted travel-support brand connecting African travelers with Egypt through technology, information, and reliable local partnerships.",
  },
];

export default function WhoWeArePage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${siteUrl}/who-we-are`,
    name: "Who We Are — MISR VISA",
    description:
      "MISR VISA is an Egypt-focused travel support brand helping African travelers with Egypt Visa on Arrival, tickets, accommodation, airport pickup, and OK-to-Board support.",
    mainEntity: {
      "@id": `${siteUrl}/#organization`,
      foundingDate: "2022",
      founder: {
        "@type": "Person",
        // Same identity as her personal website, so search engines connect MISR VISA to her.
        "@id": "https://www.fatimamjidda.com/#person",
        name: "Fatima Muhammad Jidda",
        url: "https://www.fatimamjidda.com",
        jobTitle: "Founder",
        description:
          "Software engineering professional and entrepreneur who studied and lived in Egypt.",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      {/* Hero */}
      <section className="bg-emerald py-20">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Who We Are
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">
              Egypt travel support, built from experience
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70">
              MISR VISA is an Egypt-focused travel support brand helping African travelers prepare
              for their journey to Egypt. We assist with Visa on Arrival, flight tickets,
              accommodation, airport pickup, and OK-to-Board support.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading align="left" eyebrow="Our Story" title="How MISR VISA started" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/70">
              <p>
                Our journey started in 2020, when our founder,{" "}
                <a
                  href="https://www.fatimamjidda.com"
                  className="font-medium text-ink underline underline-offset-4"
                >
                  Fatima Muhammad Jidda
                </a>
                , came to Egypt to study and
                experienced life in Egypt firsthand. After living and studying in Cairo, we
                understood many of the challenges African travelers face when preparing to travel
                to Egypt.
              </p>
              <p>
                In 2022, MISR VISA was created to make the journey easier by providing practical
                guidance and reliable Egypt travel assistance — from Egypt Visa on Arrival
                preparation to the everyday details that decide whether a trip runs smoothly.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-ivory py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading align="left" eyebrow="About the Founder" title="Experience behind the service" />
            <p className="mt-6 text-base leading-relaxed text-ink/70">
              Fatima is a software engineering professional and entrepreneur who studied and lived
              in Egypt. Her experience as an African in Egypt inspired her to build MISR VISA to
              help other travelers understand the process and feel more confident before their
              journey.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <div className="h-full rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
                  <h2 className="font-display text-xl font-semibold text-emerald-dark">
                    {p.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What this means for the traveler */}
      <section className="bg-ivory py-20">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="What this means for you"
              title="Fewer unknowns before you fly"
            />
            <p className="mt-6 text-base leading-relaxed text-ink/70">
              Preparing for Egypt raises a lot of questions at once — what the Visa on Arrival
              process actually involves, whether your airline needs OK-to-Board, where you&rsquo;ll
              stay, and who meets you when you land. MISR VISA handles those pieces together, so
              you get straight answers and Egypt visa assistance from people who have been through
              it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/apply">Start Your Application</Button>
              <Button href="/how-it-works" variant="secondary">
                See How It Works
              </Button>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-ink/55">
              MISR VISA is a private travel support provider — not an embassy or government body.
              Visa approval and entry into Egypt are decided solely by Egyptian immigration
              authorities.
            </p>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
