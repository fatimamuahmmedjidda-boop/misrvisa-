import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { createPartnerSession } from "@/lib/partnerAuth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  const partner = await prisma.partner.findUnique({ where: { email: parsed.data.email } });
  if (!partner || !partner.active) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const valid = await bcrypt.compare(parsed.data.password, partner.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  await createPartnerSession({
    partnerId: partner.id,
    email: partner.email,
    name: partner.name,
  });

  return NextResponse.json({ ok: true });
}
