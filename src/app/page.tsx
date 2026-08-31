import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/ServiceCard";
import CTASection from "@/components/CTASection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQAccordion from "@/components/FAQAccordion";
import Reveal from "@/components/Reveal";
import { services } from "@/lib/content/services";
import { prisma } from "@/lib/prisma";

const whoWeHelp = [
  { title: "Tourism", description: "Exploring Egypt's history, culture, and cities." },
  { title: "Medical Travel", description: "Traveling to Egypt for medical care." },
  { title: "Study", description: "Coming to Egypt for education." },
  { title: "Family Visits", description: "Visiting family and loved ones in Egypt." },
];

const howItWorks = [
  { step: "1", title: "Apply Online", description: "Choose your service and submit your travel details." },
  { step: "2", title: "Get Your Tracking Number", description: "Receive a unique MISR VISA tracking number instantly." },
  { step: "3", title: "We Guide You", description: "Our team reviews your details and reaches out with next steps." },
  { step: "4", title: "Travel With Support", description: "We support you through preparation up to your arrival in Egypt." },
];

const whyMisrVisa = [
  { title: "Egypt-Focused Expertise", description: "We focus specifically on Egypt travel support, since 2022." },
  { title: "Clear, Honest Guidance", description: "We explain exactly what we do — and what we don't — with no false promises." },
  { title: "End-to-End Support", description: "From visa guidance to pickup and accommodation, we support the full journey." },
  { title: "Trackable Applications", description: "Every application gets a unique tracking number you can check anytime." },
];

export default async function HomePage() {
  const [faqs, posts] = await Promise.all([
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" }, take: 4 }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-emerald">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-gold/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 bottom-0 h-[320px] w-[320px] rounded-full bg-white/5 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
              Since 2022 · Egypt Travel Support
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-[3.4rem]">
              Egypt Visa-on-Arrival Assistance for African Travelers
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              MISR VISA helps eligible African travelers prepare for Egypt&rsquo;s Visa-on-Arrival
              process, plus tickets, accommodation, airport pickup, and OK-to-Board support —
              honestly, clearly, and with real people behind it.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/apply" variant="gold">
                Apply Now
              </Button>
              <Button
                href="/how-it-works"
                variant="secondary"
                className="!border-white/30 !bg-transparent !text-white hover:!bg-white/10"
              >
                See How It Works
              </Button>
            </div>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/85 ring-1 ring-white/15">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              Currently serving travelers arriving at Cairo International Airport
            </p>
            <p className="mt-5 text-xs leading-relaxed text-white/50">
              MISR VISA is not an embassy and does not process e-Visas. We assist with
              Visa-on-Arrival preparation — approval and entry are decided solely by Egyptian
              immigration authorities.
            </p>
          </div>
          <div className="relative hidden justify-self-end lg:block">
            <div className="flex h-80 w-80 items-center justify-center rounded-[2.5rem] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
              <Image
                src="/brand/logo-mark.png"
                alt="MISR VISA emblem"
                width={220}
                height={220}
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* What MISR VISA does */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="What we do"
              title="Real support, from application to arrival"
              description="MISR VISA is a traveler support business, not an embassy. We help eligible African travelers understand and prepare for Egypt's Visa-on-Arrival process, and support the practical side of the trip — tickets, accommodation, airport pickup, and OK-to-Board guidance where applicable."
            />
          </Reveal>
        </div>
      </section>

      {/* Who we are — short */}
      <section className="border-y border-black/5 bg-ivory py-20">
        <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
              Who we are
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold text-emerald-dark sm:text-3xl">
              From studying in Cairo to building MISR VISA
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink/70">
              After experiencing Egypt firsthand, we understood the challenges travelers face
              before arriving. MISR VISA was created in 2022 to make the journey simpler — with
              Visa on Arrival assistance and practical travel support.
            </p>
            <Link
              href="/who-we-are"
              className="mt-7 inline-block text-sm font-semibold uppercase tracking-wide text-emerald hover:text-emerald-dark"
            >
              Read our story &rarr;
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Services" title="How MISR VISA supports your trip" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 80}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why MISR VISA */}
      <section className="bg-ivory py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Why MISR VISA" title="Built on trust and clarity" />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {whyMisrVisa.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="text-center sm:text-left">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-sm font-semibold text-gold-dark sm:mx-0">
                    {i + 1}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-emerald-dark">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-emerald-dark py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Process"
            title="How it works"
            description=""
          />
          <div className="sr-only">Simple four-step application process</div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, i) => (
              <Reveal key={item.step} delay={i * 100}>
                <div className="relative rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                  <span className="font-display text-3xl font-semibold text-gold">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/how-it-works" variant="secondary" className="!border-white/30 !bg-transparent !text-white hover:!bg-white/10">
              Full process details
            </Button>
          </div>
        </div>
      </section>

      {/* Who we help */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Who we help" title="Support for every travel purpose" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whoWeHelp.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm">
                  <h3 className="font-display text-lg font-semibold text-emerald-dark">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* FAQ preview */}
      {faqs.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-5 lg:px-8">
            <SectionHeading eyebrow="FAQ" title="Common questions" />
            <div className="mt-10">
              <FAQAccordion items={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))} />
            </div>
            <div className="mt-8 text-center">
              <Button href="/faq" variant="secondary">
                View all FAQs
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Latest visa/travel info */}
      {posts.length > 0 && (
        <section className="bg-ivory py-20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionHeading eyebrow="Visa News" title="Latest travel information" />
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-gold-dark">
                    {post.category}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-emerald-dark group-hover:text-emerald">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-ink/65">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
