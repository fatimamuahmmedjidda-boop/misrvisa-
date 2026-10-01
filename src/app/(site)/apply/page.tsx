import ApplicationForm from "@/components/ApplicationForm";
import { Container, PageHero, PaperCard } from "@/components/site/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Apply for Egypt Visa on Arrival & OK-to-Board",
  description: "Start your MISR VISA application in 2 minutes. Choose a service, share your travel details and get your tracking number instantly. OK-to-Board in 24–48 hours.",
  path: "/apply",
  keywords: ["apply Egypt visa online", "Egypt OK to board application"],
});

// Static page (served instantly from the CDN); the ?service= preselection is read in the browser.
export default function ApplyPage() {
  return (
    <>
      <PageHero
        eyebrow="Apply · 2 minutes"
        title={<>Start your <span className="text-gold-gradient italic">Egypt</span> application.</>}
        lead="Choose a service and share your travel details. You'll receive a unique tracking number immediately, and our Cairo team will contact you on WhatsApp."
      />
      <section className="pb-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <PaperCard>
            <ApplicationForm />
          </PaperCard>
          <aside className="space-y-4 text-sm">
            {[
              ["Have ready", "Passport details and a confirmed EgyptAir or Ethiopian Airlines ticket."],
              ["Timing", "OK-to-Board usually takes 24–48 hours. Apply at least 3 days before you fly."],
              ["At Cairo Airport", "Pay USD 36 (USD 30 visa + USD 6 service charge) for your QR visa."],
              ["Your data is protected", "Encrypted in transit, visible only to MISR VISA staff, never sold."],
            ].map(([t, b]) => (
              <div key={t} className="rounded-2xl border border-ivory/10 bg-white/[0.02] p-5">
                <p className="font-semibold text-gold">{t}</p>
                <p className="mt-1.5 leading-relaxed text-ivory/60">{b}</p>
              </div>
            ))}
          </aside>
        </Container>
      </section>
    </>
  );
}
