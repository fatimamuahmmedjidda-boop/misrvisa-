import { NextResponse } from "next/server";
import { z } from "zod";
import { guardRequest } from "@/lib/rateLimit";
import { requireCustomer } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { settlePayment } from "@/lib/payments/service";

const schema = z.object({ reference: z.string().trim().min(6).max(120) });

/**
 * Called when the customer returns from the provider. This does NOT trust the
 * browser: it asks the provider for the real status. The webhook does the same
 * thing independently, so a closed browser tab never loses a payment.
 */
export async function POST(request: Request) {
  const blocked = guardRequest(request, "payment-verify", 30, 60 * 60_000);
  if (blocked) return blocked;

  const auth = await requireCustomer(request);
  if (!auth.ok) return auth.response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid reference." }, { status: 400 });

  // The reference must belong to this customer.
  const payment = await prisma.payment.findFirst({
    where: { providerReference: parsed.data.reference, customerId: auth.actor.id },
    select: { id: true },
  });
  if (!payment) return NextResponse.json({ error: "Payment not found." }, { status: 404 });

  const result = await settlePayment({
    reference: parsed.data.reference,
    actor: { type: "CUSTOMER", id: auth.actor.id, email: auth.actor.email },
    request,
  });

  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({
    status: "settled" in result && result.settled ? "SUCCESS" : ("status" in result ? result.status : "SUCCESS"),
  });
}
