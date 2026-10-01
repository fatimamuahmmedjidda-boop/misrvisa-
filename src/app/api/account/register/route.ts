import { guardRequest } from "@/lib/rateLimit";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { customerRegisterSchema } from "@/lib/validation";
import { createCustomerSession } from "@/lib/customerAuth";

// Sets a password on an existing customer record (created when they applied).
// We do not create brand-new customer records here — an account only exists
// once someone has actually submitted an application.
export async function POST(request: Request) {
  const blocked = guardRequest(request, "account-register", 5, 60 * 60_000);
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = customerRegisterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid email and a password of at least 8 characters." },
      { status: 400 }
    );
  }

  const customer = await prisma.customer.findUnique({ where: { email: parsed.data.email } });

  if (!customer) {
    return NextResponse.json(
      { error: "We couldn't find an application with that email. Apply first, then set a password." },
      { status: 404 }
    );
  }

  if (customer.passwordHash) {
    return NextResponse.json(
      { error: "An account already exists for this email. Please sign in instead." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const updated = await prisma.customer.update({
    where: { id: customer.id },
    data: { passwordHash, sessionVersion: { increment: 1 } },
  });

  await createCustomerSession({
    customerId: customer.id,
    email: customer.email,
    fullName: customer.fullName,
    v: String(updated.sessionVersion),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
