import { Suspense } from "react";
import TrackForm from "@/components/TrackForm";
import { Container, PageHero, PaperCard } from "@/components/site/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Track Your Egypt Visa & OK-to-Board Application",
  description: "Enter your MISR VISA tracking number to check your Egypt visa on arrival and OK-to-Board application status in real time.",
  path: "/track",
  keywords: ["track Egypt visa application", "Egypt visa status"],
});

export default function TrackPage() {
  return (
    <>
      <PageHero
        eyebrow="Live tracking"
        title={<>Where is my <span className="text-gold-gradient italic">application</span>?</>}
        lead="Enter the tracking number from your confirmation, for example MVR-2026-0001."
      />
      <section className="pb-28">
        <Container className="max-w-2xl">
          <PaperCard>
            <Suspense fallback={null}>
              <TrackForm />
            </Suspense>
          </PaperCard>
        </Container>
      </section>
    </>
  );
}
