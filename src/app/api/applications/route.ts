import { guardRequest } from "@/lib/rateLimit";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validation";
import { generateTrackingId } from "@/lib/tracking";
import { createCustomerSession } from "@/lib/customerAuth";
import { sendEmail } from "@/lib/email";
import { applicationReceivedEmail } from "@/lib/email/templates";
import { serviceName } from "@/lib/content/services";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  const blocked = guardRequest(request, "applications", 10, 60 * 60_000);
  if (blocked) return blocked;

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
    const partner = data.referralCode
      ? await prisma.partner.findUnique({ where: { referralCode: data.referralCode.toUpperCase() } })
      : null;

    const existing = await prisma.customer.findUnique({ where: { email: data.email } });

    // Only set a password on first signup; never overwrite an existing account's
    // password from an unauthenticated application form.
    const passwordHash =
      data.password && !existing?.passwordHash ? await bcrypt.hash(data.password, 12) : undefined;

    // An unauthenticated form must never rewrite an existing account's profile:
    // otherwise anyone who knows a customer's email could change their name,
    // nationality or WhatsApp number. Contact details are only set when the
    // record is new (or has no password yet, i.e. no account owner).
    const mayUpdateProfile = !existing?.passwordHash;

    const customer = await prisma.customer.upsert({
      where: { email: data.email },
      update: {
        ...(mayUpdateProfile
          ? { fullName: data.fullName, nationality: data.nationality, whatsapp: data.whatsapp }
          : {}),
        ...(passwordHash ? { passwordHash } : {}),
        ...(partner && !existing?.referredByPartnerId
          ? { referredByPartnerId: partner.id }
          : {}),
      },
      create: {
        fullName: data.fullName,
        nationality: data.nationality,
        whatsapp: data.whatsapp,
        email: data.email,
        ...(passwordHash ? { passwordHash } : {}),
        ...(partner ? { referredByPartnerId: partner.id } : {}),
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
            partnerId: partner?.id ?? customer.referredByPartnerId ?? null,
          },
        });

        // First entry in the status timeline.
        await prisma.applicationStatusHistory.create({
          data: {
            applicationId: application.id,
            newStatus: application.status,
            changedByType: "CUSTOMER",
            changedById: customer.id,
            changedByName: customer.fullName,
            note: "Application submitted through the website.",
          },
        });

        if (passwordHash) {
          const withSession = await prisma.customer.findUniqueOrThrow({
            where: { id: customer.id },
            select: { sessionVersion: true },
          });
          await createCustomerSession({
            customerId: customer.id,
            email: customer.email,
            fullName: customer.fullName,
            v: String(withSession.sessionVersion),
          });
        }

        await sendEmail(
          applicationReceivedEmail({
            to: customer.email,
            fullName: customer.fullName,
            trackingId: application.trackingId,
            serviceName: serviceName(application.service),
          }),
        );

        return NextResponse.json(
          { trackingId: application.trackingId, accountCreated: Boolean(passwordHash) },
          { status: 201 }
        );
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
