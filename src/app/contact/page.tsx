import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import {
  socialLinks,
  CONTACT_EMAIL,
  WHATSAPP_NUMBER,
  WHATSAPP_LINK,
  MANAGER_PHONE,
  MANAGER_PHONE_LINK,
} from "@/lib/content/social";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with MISR VISA about Egypt Visa-on-Arrival assistance and traveler support services.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-5 lg:grid lg:grid-cols-5 lg:gap-12 lg:px-8">
        <div className="lg:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
            Contact
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold text-emerald-dark">
            Get in Touch
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink/65">
            Have a question before applying, or need help with an existing application? Send us a
            message and our team will respond directly.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-ink/65">
            Already started an application?{" "}
            <a href="/track" className="font-semibold text-emerald underline">
              Track its status
            </a>{" "}
            with your MISR VISA tracking number.
          </p>

          <div className="mt-8 border-t border-ink/10 pt-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-emerald">
              Email
            </h2>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-2 inline-block text-sm text-ink/70 hover:text-emerald"
            >
              {CONTACT_EMAIL}
            </a>

            <h2 className="mt-6 text-xs font-semibold uppercase tracking-wider text-emerald">
              WhatsApp
            </h2>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-ink/70 hover:text-emerald"
            >
              {WHATSAPP_NUMBER}
            </a>

            <h2 className="mt-6 text-xs font-semibold uppercase tracking-wider text-emerald">
              Manager (Direct)
            </h2>
            <a
              href={MANAGER_PHONE_LINK}
              className="mt-2 inline-block text-sm text-ink/70 hover:text-emerald"
            >
              {MANAGER_PHONE}
            </a>

            <h2 className="mt-6 text-xs font-semibold uppercase tracking-wider text-emerald">
              Follow Us
            </h2>
            <div className="mt-3 flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald/10 text-emerald transition hover:bg-emerald hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 lg:col-span-3 lg:mt-0">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
