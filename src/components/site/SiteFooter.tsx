import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL, MANAGER_PHONE, MANAGER_PHONE_LINK, WHATSAPP_LINK, socialLinks } from "@/lib/content/social";
import { Container } from "@/components/site/ui";

const columns = [
  {
    title: "Egypt Visa",
    links: [
      { href: "/visa-on-arrival", label: "Egypt Visa on Arrival (USD 36)" },
      { href: "/services/ok-to-board", label: "OK-to-Board in 24–48h" },
      { href: "/how-it-works", label: "How to Apply" },
      { href: "/faq", label: "Egypt Visa FAQ" },
      { href: "/track", label: "Track Application" },
    ],
  },
  {
    title: "Travel Services",
    links: [
      { href: "/services/ticket-assistance", label: "EgyptAir & Ethiopian Tickets" },
      { href: "/services/accommodation", label: "Hotels in Cairo" },
      { href: "/services/airport-pickup", label: "Cairo Airport Pickup" },
      { href: "/services", label: "All Services" },
    ],
  },
  {
    title: "Egypt Stories",
    links: [
      { href: "/blog/egypt-visa-on-arrival-2026-guide", label: "Egypt Visa Guide 2026" },
      { href: "/blog/history-of-ancient-egypt", label: "History of Ancient Egypt" },
      { href: "/blog/grand-egyptian-museum-guide", label: "Grand Egyptian Museum" },
      { href: "/blog/investing-in-egypt", label: "Investing in Egypt" },
      { href: "/blog", label: "All Stories" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/who-we-are", label: "Who We Are" },
      { href: "/partner", label: "Agency Partnership" },
      { href: "/partner-portal/login", label: "Partner Portal" },
      { href: "/account/login", label: "Traveler Account" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-gold/10 bg-night-950">
      <div aria-hidden className="absolute -bottom-40 left-1/2 h-80 w-[1100px] -translate-x-1/2 rounded-full bg-emerald-glow/10 blur-[120px]" />
      <Container className="relative py-20">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image src="/brand/logo-mark.png" alt="MISR VISA logo" width={48} height={48} className="rounded-2xl ring-1 ring-gold/30" />
              <span className="font-display text-2xl font-semibold tracking-[0.12em] text-ivory">MISR VISA</span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ivory/55">
              Cairo-based travel assistance for African travelers visiting Egypt — OK-to-Board, visa-on-arrival guidance,
              flights, hotels and airport pickup.
            </p>
            <div className="mt-8 space-y-2 text-sm">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="block text-ivory/80 hover:text-gold">
                WhatsApp us →
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="block text-ivory/80 hover:text-gold">
                {CONTACT_EMAIL}
              </a>
              <a href={MANAGER_PHONE_LINK} className="block text-ivory/80 hover:text-gold">
                Manager: {MANAGER_PHONE}
              </a>
            </div>
            <div className="mt-8 flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`MISR VISA on ${s.name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/10 text-ivory/60 transition-colors hover:border-gold/50 hover:text-gold"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">{col.title}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-ivory/60 transition-colors hover:text-ivory">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-ivory/10 pt-8 text-xs leading-relaxed text-ivory/40">
          <p>
            MISR VISA is a private travel assistance company and is not affiliated with the Government of Egypt, any embassy
            or any airline. Visa and entry decisions are made solely by the Egyptian authorities. The official
            visa-on-arrival portal is visaonarrival.gov.eg. Fees quoted are set by the authorities and may change.
          </p>
          <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row">
            <p>
              © {new Date().getFullYear()} MISR VISA. All rights reserved. Owned, designed &amp; developed by{" "}
              <a href="https://www.fatimamjidda.com" target="_blank" rel="noopener" className="text-gold/80 underline-offset-4 hover:text-gold hover:underline">
                Fatima Muhammad Jidda
              </a>
              .
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-ivory">Terms</Link>
              <Link href="/privacy" className="hover:text-ivory">Privacy</Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
