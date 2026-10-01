import { Container, PageHero, PaperCard } from "@/components/site/ui";
import { CONTACT_EMAIL } from "@/lib/content/social";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How MISR VISA collects, uses and protects the personal information of travelers and partners.",
  path: "/privacy",
});

const sections: [string, string][] = [
  ["What we collect", "When you apply, register or contact us we collect the details you provide: name, nationality, email, WhatsApp number, travel dates and purpose, and any documents or notes you share. Partners provide business contact details. We also collect anonymous, cookie-free usage statistics to improve the website."],
  ["How we use it", "Only to deliver the services you request — reviewing your application, arranging OK-to-Board, flights, accommodation and pickup — to update you on your status, and to respond to your messages. We do not sell your personal information."],
  ["Who can see it", "Authorized MISR VISA staff through a password-protected dashboard. Where needed to deliver your service, relevant details are shared with airlines, hotels or transport providers. Referring partners can see the status of travelers linked to their referral code."],
  ["How we protect it", "Connections to this website are encrypted (HTTPS). Passwords are stored as one-way hashes, sessions use signed secure cookies, and access to the admin area is restricted and rate-limited."],
  ["How long we keep it", "For as long as needed to provide the service and meet legal or accounting obligations, after which it is deleted or anonymized."],
  ["Your rights", `You can ask to access, correct or delete your information at any time by emailing ${CONTACT_EMAIL}.`],
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" lead="Last updated: 17 September 2026" />
      <section className="pb-24">
        <Container className="max-w-3xl">
          <PaperCard>
            <div className="space-y-8 text-sm leading-relaxed text-ink/75">
              {sections.map(([t, b]) => (
                <div key={t}>
                  <h2 className="font-display text-xl font-semibold text-emerald-dark">{t}</h2>
                  <p className="mt-2">{b}</p>
                </div>
              ))}
            </div>
          </PaperCard>
        </Container>
      </section>
    </>
  );
}
