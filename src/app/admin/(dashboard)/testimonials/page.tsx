import { prisma } from "@/lib/prisma";
import TestimonialsAdmin from "@/components/admin/TestimonialsAdmin";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-emerald-dark">Testimonials</h1>
      <p className="mt-1 text-sm text-ink/60">
        Real testimonials only — never publish fake reviews.
      </p>
      <div className="mt-6">
        <TestimonialsAdmin testimonials={testimonials} />
      </div>
    </div>
  );
}
