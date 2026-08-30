import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validation";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid testimonial." },
      { status: 400 }
    );
  }

  const testimonial = await prisma.testimonial.create({
    data: {
      customerName: parsed.data.customerName,
      countryFlag: parsed.data.countryFlag || null,
      quote: parsed.data.quote,
      isPlaceholder: false,
      published: parsed.data.published ?? false,
    },
  });

  return NextResponse.json(testimonial, { status: 201 });
}
