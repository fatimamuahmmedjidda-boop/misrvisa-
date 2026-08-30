import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validation";
import { generateTrackingId } from "@/lib/tracking";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = applicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const customer = await prisma.customer.upsert({
      where: { email: data.email },
      update: {
        fullName: data.fullName,
        nationality: data.nationality,
        whatsapp: data.whatsapp,
      },
      create: {
        fullName: data.fullName,
        nationality: data.nationality,
        whatsapp: data.whatsapp,
        email: data.email,
      },
    });

    // Retry a few times in the rare case two applications race for the same
    // per-year sequence number and collide on the unique trackingId.
    let lastError: unknown;
    for (let attempt = 0; attempt < 5; attempt++) {
      const trackingId = await generateTrackingId();
      try {
        const application = await prisma.application.create({
          data: {
            trackingId,
            customerId: customer.id,
            service: data.service,
            travelPurpose: data.travelPurpose,
            travelDate: data.travelDate ? new Date(data.travelDate) : null,
            additionalInfo: data.additionalInfo || null,
          },
        });
        return NextResponse.json({ trackingId: application.trackingId }, { status: 201 });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
          lastError = err;
          continue;
        }
        throw err;
      }
    }
    throw lastError;
  } catch (err) {
    console.error("Failed to create application", err);
    return NextResponse.json(
      { error: "We couldn't submit your application. Please try again shortly." },
      { status: 500 }
    );
  }
}
