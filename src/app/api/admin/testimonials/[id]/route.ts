import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validation";

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/testimonials/[id]">) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = testimonialSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }

  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { ...parsed.data, isPlaceholder: false },
    });
    return NextResponse.json(testimonial);
  } catch (err) {
    console.error("Failed to update testimonial", err);
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext<"/api/admin/testimonials/[id]">) {
  const { id } = await params;
  try {
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete testimonial", err);
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
}
