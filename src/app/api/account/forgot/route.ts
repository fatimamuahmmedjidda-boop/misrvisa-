import { guardRequest } from "@/lib/rateLimit";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { buildResetRecord, RESET_TOKEN_TTL_MINUTES } from "@/lib/passwordReset";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail } from "@/lib/email/templates";
import { logAudit } from "@/lib/audit";
import { SITE_URL } from "@/lib/content/social";

const schema = z.object({ email: z.string().trim().email() });

export async function POST(request: Request) {
  const blocked = guardRequest(request, "account-forgot", 5, 60 * 60_000);
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();

  const [customer, partner] = await Promise.all([
    prisma.customer.findUnique({ where: { email }, select: { id: true } }),
    prisma.partner.findUnique({ where: { email }, select: { active: true } }),
  ]);

  const userType = customer ? "CUSTOMER" : partner?.active ? "PARTNER" : null;

  if (userType) {
    // Drop any earlier unused link for this email so only the newest one works.
    await prisma.passwordReset.deleteMany({ where: { email, usedAt: null } });

    // Nothing replayable is stored: only the hash authenticates, and the
    // legacy `token` column holds an unrelated random placeholder.
    const record = buildResetRecord();
    await prisma.passwordReset.create({
      data: {
        email,
        userType,
        token: record.token,
        tokenHash: record.tokenHash,
        expiresAt: record.expiresAt,
      },
    });

    // Both travelers and partners set their new password on the same screen;
    // the stored userType decides which account is updated.
    const base = (process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL).replace(/\/$/, "");
    const resetUrl = `${base}/account/reset?token=${encodeURIComponent(record.rawToken)}`;

    const delivery = await sendEmail(passwordResetEmail({ to: email, resetUrl, minutes: RESET_TOKEN_TTL_MINUTES }));

    // Local development only: with no email provider configured there would be
    // no way to continue the flow. Never in production, never in the database,
    // never in the audit log.
    if (!delivery.ok && process.env.NODE_ENV !== "production") {
      console.warn(`[dev] password reset link for ${email}: ${resetUrl}`);
    }
    await logAudit({
      actor: { type: "SYSTEM" },
      action: "PASSWORD_RESET_REQUESTED",
      entity: userType === "PARTNER" ? "Partner" : "Customer",
      metadata: { userType },
      request,
    });
  }

  // Always the same response, so this endpoint cannot be used to discover
  // which email addresses have accounts.
  return NextResponse.json({ ok: true });
}
