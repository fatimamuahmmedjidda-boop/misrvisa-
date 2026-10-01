import ContactForm from "@/components/ContactForm";
import { Container, PageHero, PaperCard } from "@/components/site/ui";
import { CONTACT_EMAIL, MANAGER_PHONE, MANAGER_PHONE_LINK, WHATSAPP_LINK, WHATSAPP_NUMBER, socialLinks } from "@/lib/content/social";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact MISR VISA — Egypt Visa & Travel Help on WhatsApp",
  description: "Talk to the MISR VISA team in Cairo about Egypt visa on arrival, OK-to-Board, flights, hotels and airport pickup. WhatsApp, email or send a message.",
  path: "/contact",
  keywords: ["contact Misr visa", "Egypt visa WhatsApp"],
});

export default function ContactPage() {
  const channels = [
    { label: "WhatsApp", value: WHATSAPP_NUMBER, href: WHATSAPP_LINK, external: true },
    { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { label: "Manager (direct)", value: MANAGER_PHONE, href: MANAGER_PHONE_LINK },
  ];
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Talk to our <span className="text-gold-gradient italic">Cairo</span> team.</>} lead="Questions before applying, or help with an existing application — we reply directly." />
      <section className="pb-28">
        <Container className="grid gap-10 lg:grid-cols-[360px_1fr]">
          <div className="space-y-4">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="gold-frame block rounded-[22px] bg-white/[0.02] p-6 transition-transform hover:-translate-y-0.5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">{c.label}</p>
                <p className="mt-2 text-lg text-ivory">{c.value}</p>
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              {socialLinks.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 hover:border-gold hover:text-gold">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <PaperCard>
            <ContactForm />
          </PaperCard>
        </Container>
      </section>
    </>
  );
}
