"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links: { href: string; label: string }[] = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/visa-on-arrival", label: "Visa-on-Arrival" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/blog", label: "Visa News" },
  { href: "/faq", label: "FAQ" },
  { href: "/partner", label: "Partner With Us" },
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close mobile menu on route change
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur border-black/5 shadow-sm"
          : "bg-white border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="MISR VISA home">
          <Image
            src="/brand/logo-mark.png"
            alt="MISR VISA"
            width={36}
            height={36}
            className="h-9 w-9 rounded-md"
            priority
          />
          <span className="font-display text-lg font-semibold tracking-tight text-emerald">
            MISR VISA
          </span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] font-medium uppercase tracking-wide transition-colors hover:text-emerald ${
                pathname === link.href ? "text-emerald" : "text-ink/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/contact"
            className="text-[13px] font-semibold uppercase tracking-wide text-emerald transition-colors hover:text-emerald-light"
          >
            Contact Us
          </Link>
          <Link
            href="/apply"
            className="rounded-full bg-emerald px-5 py-2.5 text-[13px] font-semibold uppercase tracking-wide text-white shadow-sm transition-all hover:bg-emerald-dark hover:shadow-md"
          >
            Apply Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md text-emerald lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-black/5 bg-white lg:hidden">
          <div className="flex flex-col gap-1 px-5 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-ivory hover:text-emerald"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="rounded-md px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-ivory hover:text-emerald"
            >
              Contact Us
            </Link>
            <Link
              href="/apply"
              className="mt-2 rounded-full bg-emerald px-5 py-3 text-center text-sm font-semibold uppercase tracking-wide text-white"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
