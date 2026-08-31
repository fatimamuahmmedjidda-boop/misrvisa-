"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Only the few links most visitors actually need sit in the bar. Everything
// else lives in the menu panel, so the header stays light on desktop instead
// of showing ten items at once.
const primaryLinks = [
  { href: "/services", label: "Services" },
  { href: "/visa-on-arrival", label: "Visa-on-Arrival" },
  { href: "/how-it-works", label: "How It Works" },
];

const menuLinks = [
  { href: "/services", label: "Services" },
  { href: "/visa-on-arrival", label: "Visa-on-Arrival" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/who-we-are", label: "Who We Are" },
  { href: "/faq", label: "FAQ" },
  { href: "/blog", label: "Visa News" },
  { href: "/track", label: "Track Application" },
  { href: "/partner", label: "Partner With Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close menu on route change
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-black/5 bg-white/90 shadow-sm backdrop-blur-md"
          : "border-transparent bg-white"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="MISR VISA home">
          <Image
            src="/brand/logo-mark.png"
            alt="MISR VISA"
            width={36}
            height={36}
            className="h-9 w-9 rounded-md"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-[0.18em] text-emerald">
            MISR VISA
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap text-sm transition-colors hover:text-emerald ${
                pathname === link.href ? "text-emerald" : "text-ink/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/apply"
            className="whitespace-nowrap rounded-full bg-emerald px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-emerald-dark hover:shadow-md"
          >
            Apply Now
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-emerald transition-colors hover:bg-ivory"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 8h16M4 16h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">
            <div className="grid gap-x-10 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm text-ink/75 transition-colors hover:bg-ivory hover:text-emerald"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-black/5 pt-5">
              <Link
                href="/account/login"
                className="text-sm font-semibold text-emerald hover:text-emerald-dark"
              >
                Sign In to Your Account
              </Link>
              <Link
                href="/partner-portal/login"
                className="text-sm text-ink/55 hover:text-emerald"
              >
                Partner Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
