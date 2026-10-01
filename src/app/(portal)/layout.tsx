import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";

// Dashboards and sign-in screens are private: keep them out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ivory text-ink">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gold/20 bg-night-950 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/brand/logo-mark.png" alt="" width={32} height={32} className="rounded-lg ring-1 ring-gold/30" />
          <span className="font-display text-base font-semibold tracking-[0.12em] text-ivory">MISR VISA</span>
          <span className="hidden rounded-full border border-gold/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold sm:inline">
            Secure portal
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-[13px]">
          <Link href="/track" className="rounded-full px-3 py-2 text-ivory/70 hover:text-ivory">Track</Link>
          <Link href="/" className="rounded-full px-3 py-2 text-ivory/70 hover:text-ivory">← Website</Link>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
