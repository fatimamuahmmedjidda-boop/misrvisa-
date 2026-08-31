import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createResetToken, resetExpiry } from "@/lib/passwordReset";

const schema = z.object({ email: z.string().trim().email() });

export async function POST(request: Request) {
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
    await prisma.passwordReset.create({
      data: { email, userType, token: createResetToken(), expiresAt: resetExpiry() },
    });
  }

  // Always the same response, so this endpoint cannot be used to discover
  // which email addresses have accounts.
  return NextResponse.json({ ok: true });
}
