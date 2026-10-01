import Link from "next/link";
import type { ReactNode } from "react";
import type { ArticleMotif } from "@/lib/content/articles";

/** Renders the article mini-markdown as React elements (no raw HTML, so no injection). */
export function ArticleBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n{2,}/);
  return (
    <div className="article-body">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (block.startsWith("## ")) return <h2 key={i} id={slugify(block.slice(3))}>{inline(block.slice(3))}</h2>;
        if (block.startsWith("### ")) return <h3 key={i}>{inline(block.slice(4))}</h3>;
        if (block.startsWith("> ")) return <blockquote key={i}>{inline(block.slice(2))}</blockquote>;
        if (lines.every((l) => l.startsWith("- ")))
          return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.slice(2))}</li>)}</ul>;
        if (lines.every((l) => /^\d+\. /.test(l)))
          return <ol key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\d+\. /, ""))}</li>)}</ol>;
        if (block.startsWith("*") && block.endsWith("*") && !block.startsWith("**"))
          return <p key={i} className="text-sm italic text-ivory/50">{block.slice(1, -1)}</p>;
        return <p key={i}>{inline(block)}</p>;
      })}
    </div>
  );
}

export function headingsOf(body: string) {
  return body
    .split(/\n{2,}/)
    .filter((b) => b.startsWith("## "))
    .map((b) => ({ id: slugify(b.slice(3)), text: b.slice(3).replace(/\*\*/g, "") }));
}

function slugify(s: string) {
  return s.toLowerCase().replace(/\*\*/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[(.+?)\]\((\/[^)\s]*)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index}>{m[1]}</strong>);
    else out.push(<Link key={m.index} href={m[3]}>{m[2]}</Link>);
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const motifs: Record<ArticleMotif, ReactNode> = {
  passport: (
    <>
      <rect x="70" y="40" width="80" height="110" rx="8" />
      <circle cx="110" cy="85" r="20" />
      <path d="M92 95l18-30 18 30z" />
      <path d="M88 130h44" />
    </>
  ),
  plane: (
    <>
      <path d="M40 120 Q110 20 190 90" strokeDasharray="3 7" />
      <path d="M150 62l30 8-22 20-4-12z" />
      <circle cx="40" cy="120" r="5" />
    </>
  ),
  pyramid: (
    <>
      <path d="M40 150 100 50l60 100z" />
      <path d="M130 150l35-58 35 58" />
      <path d="M100 50l10 100" />
      <path d="M20 150h190" />
    </>
  ),
  museum: (
    <>
      <path d="M50 70 110 35l60 35z" />
      <path d="M60 75v60M85 75v60M110 75v60M135 75v60M160 75v60" />
      <path d="M45 140h130" />
    </>
  ),
  sun: (
    <>
      <circle cx="110" cy="95" r="30" />
      <path d="M110 40v-15M110 165v-15M55 95H40M180 95h-15M71 56 60 45M149 56l11-11M71 134l-11 11M149 134l11 11" />
      <path d="M30 150h160" />
    </>
  ),
  chart: (
    <>
      <path d="M40 150h150M40 150V40" />
      <path d="M55 130l35-30 25 15 55-60" />
      <path d="M150 55h20v20" />
    </>
  ),
  nile: (
    <>
      <path d="M20 110c30-20 50 20 80 0s50-20 80 0 30 10 30 10" />
      <path d="M20 135c30-20 50 20 80 0s50-20 80 0" />
      <path d="M90 95V45l30 40H80" />
    </>
  ),
  city: (
    <>
      <path d="M30 150V90h25v60M60 150V60h30v90M95 150V75h20v75M120 150V40l12-15 12 15v110M150 150V85h35v65" />
      <path d="M20 150h180" />
    </>
  ),
};

export function ArticleCover({ motif, category, className = "" }: { motif: ArticleMotif; category: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-emerald-dark via-night-800 to-night-950 ${className}`}>
      <div aria-hidden className="absolute inset-0 bg-grid opacity-70" />
      <div aria-hidden className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
      <svg viewBox="0 0 220 190" className="absolute inset-0 m-auto h-3/4 w-3/4 text-gold/80" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {motifs[motif]}
      </svg>
      <span className="absolute left-4 top-4 rounded-full border border-gold/30 bg-night-950/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur">
        {category}
      </span>
    </div>
  );
}
