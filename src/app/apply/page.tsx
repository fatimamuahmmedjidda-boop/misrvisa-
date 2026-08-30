import type { Metadata } from "next";
import ApplicationForm from "@/components/ApplicationForm";

export const metadata: Metadata = {
  title: "Apply Now",
  description: "Start your MISR VISA application — choose a service and submit your travel details to get your tracking number.",
  alternates: { canonical: "/apply" },
};

export default async function ApplyPage({ searchParams }: PageProps<"/apply">) {
  const params = await searchParams;
  const service = typeof params.service === "string" ? params.service : undefined;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl px-5 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
            Apply
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold text-emerald-dark">
            Start Your Application
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink/65">
            Choose a service and share your travel details. You&rsquo;ll get a unique tracking
            number right away.
          </p>
        </div>

        <div className="mt-12">
          <ApplicationForm preselectedService={service} />
        </div>
      </div>
    </section>
  );
}
