"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NAV_LINKS } from "@/lib/content/site";

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after navigation (adjusting state during render, per React docs).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={`mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full px-4 transition-all duration-500 sm:px-6 ${
          scrolled || open
            ? "border border-gold/15 bg-night-950/85 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            : "border border-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-3" aria-label="MISR VISA home">
          <Image src="/brand/logo-mark.png" alt="" width={36} height={36} className="rounded-xl ring-1 ring-gold/30" priority />
          <span className="whitespace-nowrap leading-none">
            <span className="block font-display text-lg font-semibold tracking-[0.12em] text-ivory">MISR VISA</span>
            <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.32em] text-gold/80">Cairo · Egypt</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                  active ? "text-gold" : "text-ivory/70 hover:text-ivory"
                }`}
              >
                {l.label}
                {active && <span className="absolute inset-x-3.5 -bottom-0.5 h-px bg-gold/70" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/account/login" className="hidden whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium text-ivory/70 hover:text-ivory sm:block">
            Sign in
          </Link>
          <Link
            href="/apply"
            className="hidden rounded-full bg-gold-gradient px-5 py-2.5 text-[13px] font-semibold text-night-950 transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Apply now
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-px w-5 bg-current transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-5 bg-current transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 -z-10 overflow-y-auto bg-night-950 px-4 pb-8 pt-24 xl:hidden"
          >
            {[...NAV_LINKS, { href: "/who-we-are", label: "Who We Are" }, { href: "/contact", label: "Contact" }, { href: "/account/login", label: "Sign in" }].map(
              (l, i) => (
                <motion.div key={l.href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                  <Link href={l.href} className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-base text-ivory/85 hover:bg-white/5">
                    {l.label}
                    <span className="text-gold/60">→</span>
                  </Link>
                </motion.div>
              ),
            )}
            <Link href="/apply" className="mt-2 flex justify-center rounded-2xl bg-gold-gradient px-4 py-4 font-semibold text-night-950">
              Apply now — OK-to-Board in 24–48h
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
