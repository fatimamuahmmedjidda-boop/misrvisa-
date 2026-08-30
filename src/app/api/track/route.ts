import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Enter a valid tracking number." },
      { status: 400 }
    );
  }

  const application = await prisma.application.findUnique({
    where: { trackingId: parsed.data.trackingId.toUpperCase() },
    select: {
      trackingId: true,
      service: true,
      status: true,
      createdAt: true,
    },
  });

  if (!application) {
    return NextResponse.json(
      { error: "We couldn't find an application with that tracking number." },
      { status: 404 }
    );
  }

  return NextResponse.json(application);
}
