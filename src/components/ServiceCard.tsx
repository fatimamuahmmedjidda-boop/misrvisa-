import Link from "next/link";
import type { Service } from "@/lib/content/services";

const icons: Record<Service["slug"], React.ReactNode> = {
  "visa-on-arrival": (
    <path d="M12 2c-1.5 3-2.5 6.5-2.5 10s1 7 2.5 10c1.5-3 2.5-6.5 2.5-10s-1-7-2.5-10Z M2 12h20 M12 2a15 15 0 0 1 8.5 4.5M12 2a15 15 0 0 0-8.5 4.5M3.5 17.5A15 15 0 0 0 12 22M20.5 17.5A15 15 0 0 1 12 22" />
  ),
  "ticket-assistance": (
    <path d="M2 16l20-8-7 14-3-6-6-3-4 3Z" />
  ),
  accommodation: <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5Z" />,
  "airport-pickup": (
    <path d="M5 17h14M6 17l1-8h10l1 8M9 9V6a3 3 0 0 1 6 0v3" />
  ),
  "ok-to-board": <path d="m5 13 4 4L19 7" />,
};

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex flex-col rounded-2xl border border-black/5 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald/5 text-emerald transition-colors group-hover:bg-gold/20">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icons[service.slug]}
        </svg>
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold text-emerald-dark">
        {service.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">
        {service.shortDescription}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald group-hover:text-gold-dark">
        Learn more
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
