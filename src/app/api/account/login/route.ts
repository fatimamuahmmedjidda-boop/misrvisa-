import { guardRequest } from "@/lib/rateLimit";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { createCustomerSession } from "@/lib/customerAuth";

export async function POST(request: Request) {
  const blocked = guardRequest(request, "account-login", 8, 15 * 60_000);
  if (blocked) return blocked;

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

  const customer = await prisma.customer.findUnique({ where: { email: parsed.data.email } });
  if (!customer?.passwordHash) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const valid = await bcrypt.compare(parsed.data.password, customer.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  await createCustomerSession({
    customerId: customer.id,
    email: customer.email,
    fullName: customer.fullName,
    v: String(customer.sessionVersion),
  });

  return NextResponse.json({ ok: true });
}
