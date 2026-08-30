import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { prisma } from "@/lib/prisma";

export default async function TestimonialsSection() {
  const published = await prisma.testimonial.findMany({
    where: { published: true, isPlaceholder: false },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  const items =
    published.length > 0
      ? published
      : [{ id: "p1" }, { id: "p2" }, { id: "p3" }];

  return (
    <section className="bg-ivory py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Trust"
          title="What travelers say"
          description={
            published.length > 0
              ? "Real feedback from travelers who used MISR VISA's services."
              : "Real testimonials from MISR VISA travelers will appear here as they come in."
          }
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {items.map((item, i) => {
            const testimonial = published.length > 0 ? published[i] : null;
            return (
              <Reveal key={item.id} delay={i * 100}>
                <div
                  className={`flex h-full flex-col justify-between rounded-2xl p-7 ${
                    testimonial
                      ? "border border-black/5 bg-white shadow-sm"
                      : "border border-dashed border-emerald/20 bg-white"
                  }`}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-gold-dark">
                    <path
                      d="M7 8c-2 0-3.5 1.5-3.5 3.9 0 2.4 1.7 4.1 4 4.1v-2.1c-1 0-1.7-.8-1.7-2 0-1.1.7-1.9 1.7-1.9V8Zm8.5 0c-2 0-3.5 1.5-3.5 3.9 0 2.4 1.7 4.1 4 4.1v-2.1c-1 0-1.7-.8-1.7-2 0-1.1.7-1.9 1.7-1.9V8Z"
                      fill="currentColor"
                    />
                  </svg>
                  {testimonial ? (
                    <>
                      <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/70">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <div className="mt-6 h-px w-10 bg-gold/50" />
                      <p className="mt-4 text-sm font-medium text-emerald-dark">
                        {testimonial.customerName}
                        {testimonial.countryFlag ? ` · ${testimonial.countryFlag}` : ""}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-4 text-sm italic leading-relaxed text-ink/50">
                        Customer testimonial will be added here.
                      </p>
                      <div className="mt-6 h-px w-10 bg-gold/50" />
                      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-ink/40">
                        Placeholder — pending real testimonial
                      </p>
                    </>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
