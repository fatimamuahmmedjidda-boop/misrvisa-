import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/[0.06] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold ${className}`}
    >
      <span className="h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden />
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "center",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag className="mt-5 text-balance text-4xl font-medium leading-[1.08] tracking-tight text-ivory sm:text-5xl">
        {title}
      </Tag>
      {lead && (
        <p className={`mt-5 text-pretty text-base leading-relaxed text-ivory/65 sm:text-lg ${center ? "mx-auto max-w-2xl" : ""}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

type LinkProps = ComponentProps<typeof Link> & { children: ReactNode; className?: string };

export function GoldButton({ children, className = "", ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gold-gradient px-7 py-3.5 text-sm font-semibold tracking-wide text-night-950 shadow-[0_10px_40px_-10px_rgba(235,196,135,0.6)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </Link>
  );
}

export function GhostButton({ children, className = "", ...props }: LinkProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-ivory/20 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold tracking-wide text-ivory backdrop-blur transition-colors hover:border-gold/60 hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${className}`}
    >
      {children}
    </Link>
  );
}

export function Arrow({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`${className} transition-transform group-hover:translate-x-0.5`} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Check({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="m4.5 10.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Ivory "document paper" card used to host the light-themed forms on the dark site. */
export function PaperCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-[28px] bg-ivory p-6 text-ink shadow-[0_40px_120px_-40px_rgba(235,196,135,0.35)] ring-1 ring-gold/40 sm:p-10 ${className}`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-3 rounded-[20px] border border-dashed border-gold-dark/25" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 sm:pb-24 sm:pt-44">
      <div aria-hidden className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div aria-hidden className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-glow/15 blur-[120px]" />
      <Container className="relative">
        <SectionHeader as="h1" eyebrow={eyebrow} title={title} lead={lead} />
        {children && <div className="mt-10 flex flex-wrap justify-center gap-4">{children}</div>}
      </Container>
    </section>
  );
}
