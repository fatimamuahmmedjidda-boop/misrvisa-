import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  token: z.string().min(10, "This reset link is not valid. Please request a new one."),
  password: z.string().min(8, "Password must be at least 8 characters.").max(200),
});

export async function POST(request: Request) {
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

  const reset = await prisma.passwordReset.findUnique({ where: { token: parsed.data.token } });

  if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "This reset link is no longer valid. Please request a new one." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  if (reset.userType === "CUSTOMER") {
    await prisma.customer.update({
      where: { email: reset.email },
      data: { passwordHash },
    });
  } else {
    await prisma.partner.update({
      where: { email: reset.email },
      data: { passwordHash },
    });
  }

  await prisma.passwordReset.update({
    where: { id: reset.id },
    data: { usedAt: new Date() },
  });

  return NextResponse.json({ ok: true, userType: reset.userType });
}
