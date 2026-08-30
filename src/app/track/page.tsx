import type { Metadata } from "next";
import { Suspense } from "react";
import TrackForm from "@/components/TrackForm";

export const metadata: Metadata = {
  title: "Track Your Application",
  description: "Enter your MISR VISA tracking number to check your application status.",
  alternates: { canonical: "/track" },
};

export default function TrackPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-xl px-5 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
            Track
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold text-emerald-dark">
            Track Your Application
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/65">
            Enter the tracking number from your confirmation, e.g. MVR-2026-0001.
          </p>
        </div>
        <div className="mt-12">
          <Suspense fallback={null}>
            <TrackForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
