import Link from "next/link";
import Hero from "@/components/site/Hero";
import PassportStory from "@/components/site/PassportStory";
import PhoneTracker from "@/components/site/PhoneTracker";
import { CtaBand, FaqList, OkToBoardPriceNote } from "@/components/site/sections";
import StoriesSlider from "@/components/site/StoriesSlider";
import { Counter, FadeIn, Marquee, TiltCard } from "@/components/site/motion";
import { Arrow, Check, Container, GhostButton, GoldButton, SectionHeader } from "@/components/site/ui";
import { ARTICLES } from "@/lib/content/articles";
import { services } from "@/lib/content/services";
import { FAQS, OTHER_AIRLINES, RECOMMENDED_AIRLINES, PROCESSING_OPTIONS, REQUIREMENTS, VISA_FEE } from "@/lib/content/site";
import { prisma } from "@/lib/prisma";
import { JsonLdScript, faqJsonLd, visaHowToJsonLd } from "@/lib/seo";

export const revalidate = 3600;

const serviceIcons: Record<string, string> = {
  "visa-on-arrival": "M4 6h16v12H4zM8 10h5M8 14h8",
  "ok-to-board": "M3 13l5 5L21 5",
  "ticket-assistance": "M2 16l20-8-8 12-2-5-5-2z",
  accommodation: "M3 20V8l9-5 9 5v12M9 20v-6h6v6",
  "airport-pickup": "M5 16h14l-2-6H7zM7 16v3M17 16v3M9 13h.01M15 13h.01",
};

async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { published: true, isPlaceholder: false },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript([faqJsonLd(FAQS.slice(0, 6)), visaHowToJsonLd])} />
      <Hero />

      <Marquee items={["Egypt Visa on Arrival", "OK-to-Board 24–48h", "Cairo International Airport", "EgyptAir", "Ethiopian Airlines", "Hotels & Airport Pickup", "Partner Agencies"]} />

      {/* Requirements + price */}
      <section className="relative py-28 sm:py-36" aria-labelledby="needs-title">
        <Container className="grid items-center gap-16 lg:grid-cols-[1fr_0.9fr]">
          <FadeIn>
            <SectionHeader
              align="left"
              eyebrow="Egypt visa requirements 2026"
              title={
                <span id="needs-title">
                  Passport, ticket and <span className="text-gold-gradient italic">payment in advance</span>. That&rsquo;s it.
                </span>
              }
              lead="No embassy queues and no long forms. MISR VISA prepares everything so you land in Cairo ready for your QR visa on arrival."
            />
            <ul className="mt-10 space-y-4">
              {REQUIREMENTS.map((r, i) => (
                <li key={r.title}>
                  <FadeIn delay={0.1 * i} className="flex gap-5 rounded-2xl border border-ivory/10 bg-white/[0.02] p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 font-display text-gold">{i + 1}</span>
                    <div>
                      <h3 className="font-sans text-base font-semibold text-ivory">{r.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ivory/60">{r.body}</p>
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.15}>
            <TiltCard className="bg-gradient-to-br from-night-700/80 to-night-950 p-8 sm:p-12" max={12}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">Visa on arrival · Cairo Airport</p>
              <p className="mt-6 font-display text-[7rem] leading-none text-gold-gradient sm:text-[9rem]">
                <Counter to={VISA_FEE.total} prefix="$" />
              </p>
              <div className="mt-6 space-y-3 border-t border-ivory/10 pt-6 text-sm">
                <div className="flex justify-between text-ivory/70"><span>Visa fee</span><span>USD {VISA_FEE.visaFee}</span></div>
                <div className="flex justify-between text-ivory/70"><span>Service charge</span><span>USD {VISA_FEE.serviceCharge}</span></div>
                <div className="flex justify-between font-semibold text-ivory"><span>Total per traveler</span><span>USD {VISA_FEE.total}</span></div>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-ivory/45">
                Issued as a digital QR code at Cairo International Airport since {VISA_FEE.qrSince}. Fee set by the Egyptian authorities; the
                visa fee rose to USD 30 on {VISA_FEE.feeRaisedOn}.
              </p>
              <Link href="/visa-on-arrival" className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gold">
                Full visa-on-arrival guide <Arrow />
              </Link>
            </TiltCard>
          </FadeIn>
        </Container>
      </section>

      <PassportStory />

      {/* Airlines */}
      <section className="relative py-28 sm:py-36" aria-labelledby="airlines-title">
        <Container>
          <FadeIn>
            <SectionHeader
              eyebrow="Our recommendation"
              title={
                <span id="airlines-title">
                  Fly <span className="text-gold-gradient italic">EgyptAir</span> or <span className="text-gold-gradient italic">Ethiopian</span>. Board in 24–48 hours.
                </span>
              }
              lead="These two airlines give our travelers the fastest OK-to-Board confirmations. Book with either one before you apply, and we take it from there."
            />
          </FadeIn>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {RECOMMENDED_AIRLINES.map((a, i) => (
              <FadeIn key={a.name} delay={0.1 * i}>
                <TiltCard className="p-8 sm:p-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-xs tracking-[0.3em] text-gold/70">{a.code} · {a.hub}</p>
                      <h3 className="mt-3 text-3xl text-ivory sm:text-4xl">{a.name}</h3>
                    </div>
                    <span className="rounded-full border border-emerald-glow/40 bg-emerald-glow/10 px-3 py-1.5 text-xs font-semibold text-emerald-glow">
                      24–48h OK-to-Board
                    </span>
                  </div>
                  <p className="mt-6 text-base leading-relaxed text-ivory/65">{a.note}</p>
                  <div className="relative mt-10 h-16">
                    <svg viewBox="0 0 400 60" className="h-full w-full" aria-hidden>
                      <path d="M10 50 Q200 -20 390 50" fill="none" stroke="rgba(235,196,135,0.45)" strokeWidth="1.5" strokeDasharray="3 8" />
                      <circle cx="10" cy="50" r="4" fill="#ebc487" />
                      <circle cx="390" cy="50" r="4" fill="#1fae8f" />
                    </svg>
                    <span className="absolute bottom-0 left-0 text-[10px] uppercase tracking-widest text-ivory/40">Your city</span>
                    <span className="absolute bottom-0 right-0 text-[10px] uppercase tracking-widest text-ivory/40">Cairo</span>
                  </div>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {OTHER_AIRLINES.map((a) => (
              <FadeIn key={a.name} className={`h-full rounded-[24px] border p-7 ${a.ok ? "border-gold/25 bg-gold/[0.04]" : "border-red-400/30 bg-red-500/[0.06]"}`}>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl text-ivory">{a.name}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${a.ok ? "bg-gold/15 text-gold" : "bg-red-500/15 text-red-300"}`}>{a.status}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">{a.note}</p>
              </FadeIn>
            ))}
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {PROCESSING_OPTIONS.map((o, i) => (
              <FadeIn key={o.name} className={`h-full rounded-[28px] p-8 sm:p-10 ${i === 1 ? "gold-frame bg-gold/[0.06]" : "border border-ivory/10 bg-white/[0.03]"}`}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">{o.name}</p>
                <h3 className="mt-3 text-4xl text-ivory">{o.time}</h3>
                <p className="mt-4 leading-relaxed text-ivory/65">{o.body}</p>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="mx-auto mt-10 max-w-3xl">
            <OkToBoardPriceNote />
          </FadeIn>
          <FadeIn>
            <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-ivory/40">
              Timing is based on MISR VISA&rsquo;s experience and is not guaranteed by the airlines. MISR VISA is not affiliated with EgyptAir or Ethiopian Airlines.
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Services */}
      <section className="relative py-28 sm:py-36" aria-labelledby="services-title">
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <Container>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <FadeIn>
              <SectionHeader
                align="left"
                eyebrow="Concierge travel services"
                title={<span id="services-title">One team, from your city to your hotel in Cairo.</span>}
              />
            </FadeIn>
            <FadeIn>
              <GhostButton href="/services">All services</GhostButton>
            </FadeIn>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <FadeIn key={s.slug} delay={0.06 * i} className={i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
                <TiltCard className="p-7" max={8}>
                  <Link href={`/services/${s.slug}`} className="group flex h-full flex-col">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold ring-1 ring-gold/20">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d={serviceIcons[s.slug]} />
                      </svg>
                    </span>
                    <h3 className="mt-6 text-2xl text-ivory">{s.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-ivory/55">{s.shortDescription}</p>
                    {i === 0 && (
                      <ul className="mt-6 space-y-2.5">
                        {s.whatWeHelpWith.map((w) => (
                          <li key={w} className="flex gap-2.5 text-sm text-ivory/65">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {w}
                          </li>
                        ))}
                      </ul>
                    )}
                    <span className="mt-auto flex items-center gap-2 pt-8 text-sm font-semibold text-gold">
                      Learn more <Arrow />
                    </span>
                  </Link>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <PhoneTracker />

      {/* Egypt stats */}
      <section className="relative overflow-hidden border-y border-gold/10 bg-night-900/70 py-24" aria-labelledby="egypt-title">
        <Container>
          <FadeIn>
            <SectionHeader
              eyebrow="Why Egypt"
              title={<span id="egypt-title">Africa&rsquo;s tourism powerhouse is having its biggest era.</span>}
              lead="Record visitors, the new Grand Egyptian Museum and billions in new investment — there has never been a better time to see Egypt."
            />
          </FadeIn>
          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-[28px] bg-ivory/10 lg:grid-cols-4">
            {[
              { v: 19, s: "M", l: "tourists visited Egypt in 2025" },
              { v: 21, s: "%", p: "+", l: "growth in tourists vs 2024" },
              { v: 7, l: "UNESCO World Heritage Sites" },
              { v: 30, s: "M", l: "annual tourists targeted by 2028" },
            ].map((stat) => (
              <div key={stat.l} className="flex flex-col-reverse bg-night-950 p-8 text-center sm:p-10">
                <dt className="mt-3 text-sm text-ivory/55">{stat.l}</dt>
                <dd className="font-display text-5xl text-gold-gradient sm:text-6xl">
                  <Counter to={stat.v} prefix={stat.p} suffix={stat.s} />
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-center text-xs text-ivory/35">Source: Egypt Ministry of Tourism and Antiquities, January 2026.</p>
        </Container>
      </section>

      {/* Stories */}
      <section className="relative py-28 sm:py-36" aria-labelledby="stories-title">
        <Container>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <FadeIn>
              <SectionHeader
                align="left"
                eyebrow="Egypt stories"
                title={<span id="stories-title">Visa news, 5,000 years of history, and the new Egypt.</span>}
              />
            </FadeIn>
            <FadeIn>
              <GhostButton href="/blog">Read all stories</GhostButton>
            </FadeIn>
          </div>
          <StoriesSlider
            articles={ARTICLES.map(({ slug, title, description, category, motif, readMinutes }) => ({ slug, title, description, category, motif, readMinutes }))}
          />
        </Container>
      </section>

      {testimonials.length > 0 && (
        <section className="relative py-24" aria-labelledby="reviews-title">
          <Container>
            <FadeIn>
              <SectionHeader eyebrow="Traveler stories" title={<span id="reviews-title">Trusted by travelers across Africa.</span>} />
            </FadeIn>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <FadeIn key={t.id} delay={0.06 * i}>
                  <figure className="gold-frame h-full rounded-[26px] bg-white/[0.02] p-8">
                    <p className="font-display text-5xl leading-none text-gold/60" aria-hidden>&ldquo;</p>
                    <blockquote className="mt-2 text-base leading-relaxed text-ivory/75">{t.quote}</blockquote>
                    <figcaption className="mt-6 text-sm font-semibold text-ivory">
                      {t.countryFlag} {t.customerName}
                    </figcaption>
                  </figure>
                </FadeIn>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Partner band */}
      <section className="relative py-12" aria-labelledby="partner-title">
        <Container>
          <FadeIn>
            <div className="grid items-center gap-10 rounded-[36px] border border-gold/15 bg-[linear-gradient(120deg,rgba(235,196,135,0.10),rgba(4,20,15,0.4)_45%,rgba(31,174,143,0.10))] p-8 sm:p-14 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">For travel agencies · B2B</p>
                <h2 id="partner-title" className="mt-4 text-3xl font-medium leading-tight text-ivory sm:text-4xl">
                  Partner with MISR VISA and earn commission on every client you refer.
                </h2>
                <p className="mt-4 max-w-xl text-ivory/60">
                  Business prices for agencies and companies, company contracts, and your own dashboard with live tracking — rates agreed personally with each partner.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 lg:justify-end">
                <GoldButton href="/partner">
                  Become a partner <Arrow />
                </GoldButton>
                <GhostButton href="/partner-portal/login">Partner login</GhostButton>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* FAQ */}
      <section className="relative py-28 sm:py-36" aria-labelledby="faq-title">
        <Container className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <FadeIn>
            <SectionHeader
              align="left"
              eyebrow="Egypt visa FAQ"
              title={<span id="faq-title">Questions travelers ask us every day.</span>}
              lead={
                <>
                  Can&rsquo;t find your answer? <Link href="/faq" className="text-gold underline underline-offset-4">See all FAQs</Link> or message us on WhatsApp.
                </>
              }
            />
          </FadeIn>
          <FadeIn delay={0.1}>
            <FaqList items={FAQS.slice(0, 6)} />
          </FadeIn>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
