import Link from "next/link";
import Image from "next/image";

const serviceLinks = [
  { href: "/visa-on-arrival", label: "Visa-on-Arrival" },
  { href: "/services/ticket-assistance", label: "Ticket Assistance" },
  { href: "/services/accommodation", label: "Accommodation" },
  { href: "/services/airport-pickup", label: "Airport Pickup" },
  { href: "/services/ok-to-board", label: "OK-to-Board" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/blog", label: "Visa News" },
  { href: "/faq", label: "FAQ" },
  { href: "/partner", label: "Partner With Us" },
];

const legalLinks = [
  { href: "/track", label: "Track Application" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-emerald text-white/80">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/brand/logo-mark.png"
                alt="MISR VISA"
                width={32}
                height={32}
                className="h-8 w-8 rounded-md"
              />
              <span className="font-display text-base font-semibold text-white">
                MISR VISA
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Egypt Visa-on-Arrival assistance and traveler support for African travelers, since 2022.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">Services</h3>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/70 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">Company</h3>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/70 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">Support</h3>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-white/70 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-white/5 p-5 text-xs leading-relaxed text-white/60">
          MISR VISA provides Visa-on-Arrival assistance and traveler support services for eligible
          travelers. We do not provide embassy visa processing or e-Visa processing, and we cannot
          guarantee visa approval or entry into Egypt — these decisions are made solely by Egyptian
          immigration authorities.
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} MISR VISA. All rights reserved.</p>
          <p>Egypt Visa-on-Arrival Assistance for African Travelers</p>
        </div>
      </div>
    </footer>
  );
}
