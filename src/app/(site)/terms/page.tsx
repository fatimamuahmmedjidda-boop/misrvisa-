import type { Metadata } from "next";
import { PageHero, PaperCard } from "@/components/site/ui";
import { CONTACT_EMAIL, WHATSAPP_NUMBER, MANAGER_PHONE } from "@/lib/content/social";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "MISR VISA's terms and conditions: what our services include, what we don't do, your responsibilities, fees, cancellations, and how we handle your information.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "August 31, 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" lead={`Last updated: ${LAST_UPDATED}`} />

      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <PaperCard>
            <div className="space-y-10 text-sm leading-relaxed text-ink/75">
              <p>
                These Terms &amp; Conditions (&ldquo;Terms&rdquo;) explain how MISR VISA works with you. By
                submitting an application, contacting us, or using this website, you agree to
                these Terms. Please read them before applying. If anything is unclear, contact us
                at{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-emerald underline">
                  {CONTACT_EMAIL}
                </a>{" "}
                before you proceed.
              </p>

              <div>
                <h2 className="font-display text-xl font-semibold text-emerald-dark">
                  1. Who we are
                </h2>
                <p className="mt-3">
                  MISR VISA is a traveler support and visa assistance service for eligible African
                  travelers coming to Egypt. We are an independent support business.{" "}
                  <strong>We are not an embassy, consulate, or government agency</strong>, and we
                  are not affiliated with the Egyptian government or any immigration authority.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-emerald-dark">
                  2. What we do
                </h2>
                <p className="mt-3">
                  We help with Egypt visa services and the practical side of your trip:
                </p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5">
                  <li>Visa assistance and arrival guidance for the Visa-on-Arrival process</li>
                  <li>Hotel accommodations</li>
                  <li>Personal assistance throughout your preparation</li>
                  <li>Airport pickup (optional)</li>
                  <li>Ticket and flight assistance</li>
                  <li>OK-to-Board support with airlines, where applicable</li>
                </ul>
                <p className="mt-4 rounded-xl bg-emerald/5 p-4 font-medium text-emerald-dark">
                  We are NOT a government body or embassy — MISR VISA is a private service
                  provider. Visa approval and entry into Egypt are decided solely by Egyptian
                  immigration authorities.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-emerald-dark">
                  3. What we don&rsquo;t do
                </h2>
                <p className="mt-3">To be completely clear about the limits of our service:</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5">
                  <li>We do not provide embassy visa processing or e-Visa processing.</li>
                  <li>We do not guarantee visa approval, and we cannot guarantee entry into Egypt.</li>
                  <li>
                    We do not control, influence, or make immigration decisions. Approval and
                    entry are decided solely by Egyptian immigration authorities at the border.
                  </li>
                  <li>We do not provide legal or immigration legal advice.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-emerald-dark">
                  4. Your responsibilities
                </h2>
                <p className="mt-3">When you work with MISR VISA, you agree to:</p>
                <ul className="mt-3 list-disc space-y-1.5 pl-5">
                  <li>
                    Provide accurate, complete, and truthful information and documents. Incorrect
                    or false information can delay your application or lead to it being rejected
                    by immigration authorities.
                  </li>
                  <li>Hold a valid passport and meet the eligibility requirements for your travel purpose.</li>
                  <li>Respond to our requests for documents or information in good time.</li>
                  <li>Comply with Egyptian entry requirements and local laws once you travel.</li>
                </ul>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-emerald-dark">
                  5. Fees and payment
                </h2>
                <p className="mt-3">
                  Service fees are quoted directly to you before you commit to any service and may
                  vary based on the services requested. Fees for MISR VISA&rsquo;s assistance are
                  separate from any government fees, airline fees, or third-party charges (such as
                  visa stamp fees paid on arrival), which are your responsibility and paid
                  separately as required.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-emerald-dark">
                  6. Cancellations and refunds
                </h2>
                <p className="mt-3">
                  If you cancel before we have started work on your application, we will refund
                  any service fee already paid, minus any costs already incurred on your behalf
                  (such as non-refundable ticket or accommodation bookings). Once document
                  preparation, bookings, or submission steps have started, fees already used to
                  cover that work are generally non-refundable. We will always explain the status
                  of your case and any applicable costs before charging or booking on your behalf.
                </p>
                <p className="mt-3">
                  Because visa approval and entry are decided by Egyptian immigration authorities
                  and not by MISR VISA, a decision you disagree with, a delay, or a denial by those
                  authorities is not grounds for a refund of fees already earned for work
                  performed — but we will always be honest with you about what happened and why.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-emerald-dark">
                  7. Limitation of liability
                </h2>
                <p className="mt-3">
                  MISR VISA will act carefully and honestly on your behalf, but we cannot be held
                  responsible for decisions made by immigration authorities, airlines, or other
                  third parties, or for losses caused by information or documents you provided
                  that were inaccurate or incomplete. Our liability for any claim relating to our
                  services is limited to the amount of fees you paid to MISR VISA for that
                  service.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-emerald-dark">
                  8. Your information and privacy
                </h2>
                <p className="mt-3">
                  We collect the personal and travel information you give us (such as your name,
                  contact details, nationality, and travel plans) only to process your application
                  and provide the services you request. We do not sell your personal information.
                  We may share information with airlines, accommodation providers, or authorities
                  only where necessary to deliver the service you asked for. By submitting an
                  application or contacting us, you agree that MISR VISA may contact you by
                  WhatsApp, phone, or email regarding your application or inquiry.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-emerald-dark">
                  9. Changes to these Terms
                </h2>
                <p className="mt-3">
                  We may update these Terms from time to time to reflect changes in our services
                  or the law. The &ldquo;Last updated&rdquo; date at the top of this page shows
                  when it was last revised. Continued use of our services after an update means
                  you accept the revised Terms.
                </p>
              </div>

              <div>
                <h2 className="font-display text-xl font-semibold text-emerald-dark">
                  10. Contact us
                </h2>
                <p className="mt-3">
                  If you have questions about these Terms or your application, reach us at{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-emerald underline">
                    {CONTACT_EMAIL}
                  </a>
                  , WhatsApp at {WHATSAPP_NUMBER}, or our manager directly at {MANAGER_PHONE}.
                </p>
              </div>
            </div>
          </PaperCard>
        </div>
      </section>
    </>
  );
}
