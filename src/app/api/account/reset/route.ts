import { guardRequest } from "@/lib/rateLimit";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { hashResetToken } from "@/lib/passwordReset";
import { logAudit } from "@/lib/audit";

const schema = z.object({
  token: z.string().min(10, "This reset link is not valid. Please request a new one."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
});

export async function POST(request: Request) {
  const blocked = guardRequest(request, "account-reset", 10, 60 * 60_000);
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    // Surface the password problem first — it is the one the person can fix.
    const issues = parsed.error.issues;
    const message =
      issues.find((i) => i.path[0] === "password")?.message ??
      issues[0]?.message ??
      "Check the form and try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Authentication is by hash only. The submitted value must be the raw token
  // from the email — submitting a stored hash hashes again and matches nothing.
  const tokenHash = hashResetToken(parsed.data.token);
  const reset = await prisma.passwordReset.findUnique({ where: { tokenHash } });

  if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "This reset link is no longer valid. Please request a new one." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  // Bumping sessionVersion signs out every existing session for this account.
  if (reset.userType === "CUSTOMER") {
    await prisma.customer.update({
      where: { email: reset.email },
      data: { passwordHash, sessionVersion: { increment: 1 } },
    });
  } else {
    await prisma.partner.update({
      where: { email: reset.email },
      data: { passwordHash, sessionVersion: { increment: 1 } },
    });
  }

  await logAudit({
    actor: { type: reset.userType === "PARTNER" ? "PARTNER" : "CUSTOMER", email: reset.email },
    action: "PASSWORD_RESET_COMPLETED",
    entity: reset.userType === "PARTNER" ? "Partner" : "Customer",
    metadata: { userType: reset.userType },
    request,
  });

  await prisma.passwordReset.update({
    where: { id: reset.id },
    data: { usedAt: new Date() },
  });

  return NextResponse.json({ ok: true, userType: reset.userType });
}
