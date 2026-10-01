import Link from "next/link";
import type { Article } from "@/lib/content/articles";
import { WHATSAPP_LINK } from "@/lib/content/social";
import { ArticleCover } from "@/components/site/ArticleBody";
import { Arrow, Container, GhostButton, GoldButton } from "@/components/site/ui";
import { FadeIn, QrPattern } from "@/components/site/motion";

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-ivory/10 rounded-[28px] border border-ivory/10 bg-white/[0.02]">
      {items.map((f) => (
        <details key={f.q} className="group px-6 py-5 sm:px-8 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left">
            <h3 className="font-sans text-base font-semibold text-ivory sm:text-lg">{f.q}</h3>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ivory/65">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function ArticleCard({ article, large = false }: { article: Pick<Article, "slug" | "title" | "description" | "category" | "motif" | "readMinutes">; large?: boolean }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group gold-frame flex h-full flex-col overflow-hidden rounded-[26px] bg-white/[0.02] transition-transform duration-500 hover:-translate-y-1.5"
    >
      <ArticleCover motif={article.motif} category={article.category} className={`${large ? "aspect-[16/9]" : "aspect-[16/10]"} transition-transform duration-700 group-hover:scale-[1.03]`} />
      <div className="flex flex-1 flex-col p-6">
        <h3 className={`${large ? "text-2xl sm:text-3xl" : "text-xl"} font-medium leading-snug text-ivory transition-colors group-hover:text-gold-light`}>
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ivory/55">{article.description}</p>
        <span className="mt-auto flex items-center gap-2 pt-6 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
          {article.readMinutes} min read <Arrow className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

/** OK-to-Board has no fixed price: it moves daily and by nationality, so we quote on request. */
export function OkToBoardPriceNote({ className = "" }: { className?: string }) {
  return (
    <div className={`gold-frame rounded-[24px] bg-gold/[0.05] p-6 sm:p-8 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">OK-to-Board price</p>
      <p className="mt-3 text-lg leading-relaxed text-ivory">
        The price changes <strong className="text-gold">day by day</strong> and depends on your <strong className="text-gold">nationality</strong>.
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ivory/65">
        Send us your nationality, passport and confirmed ticket — we reply with <strong className="text-ivory">today&rsquo;s price</strong> before you pay anything.
        The USD 36 visa on arrival is paid separately at Cairo Airport.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <GoldButton href="/apply?service=OK_TO_BOARD">Get today&rsquo;s price <Arrow /></GoldButton>
        <GhostButton href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">Ask on WhatsApp</GhostButton>
      </div>
    </div>
  );
}

export function CtaBand({
  title = "Your Egypt journey starts with one message.",
  lead = "Send your passport and a confirmed EgyptAir or Ethiopian Airlines ticket. We'll handle OK-to-Board in 24–48 hours.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <FadeIn>
          <div className="gold-frame relative overflow-hidden rounded-[36px] bg-gradient-to-br from-emerald via-emerald-dark to-night-900 px-6 py-16 sm:px-14 sm:py-20">
            <div aria-hidden className="absolute inset-0 bg-grid opacity-50" />
            <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/20 blur-[100px]" />
            <div className="relative grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 className="text-balance text-4xl font-medium leading-tight text-ivory sm:text-5xl">{title}</h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-ivory/70">{lead}</p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <GoldButton href="/apply">
                    Apply now <Arrow />
                  </GoldButton>
                  <GhostButton href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                    WhatsApp our team
                  </GhostButton>
                </div>
              </div>
              <div className="perspective hidden justify-center lg:flex">
                <div className="animate-float rotate-[8deg] rounded-3xl bg-ivory p-4 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] [transform:rotateY(-18deg)_rotateX(8deg)]">
                  <QrPattern className="h-44 w-44" />
                  <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-emerald">USD 36 · QR visa</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
