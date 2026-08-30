import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

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
        </div>
        <div className="mt-12 lg:col-span-3 lg:mt-0">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
