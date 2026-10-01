import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { markWebhookProcessed, processRefund, recordWebhookEvent, settlePayment } from "@/lib/payments/service";

// Webhooks must read the raw body to verify the signature, so this route is
// always dynamic and never cached.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const provider = getPaymentProvider("PAYSTACK");
  if (!provider) return NextResponse.json({ error: "Unknown provider." }, { status: 404 });

  const rawBody = await request.text();
  const parsed = provider.parseWebhook(rawBody, request.headers);
  if (!parsed.ok) {
    // Invalid signature: reject without revealing why.
    return NextResponse.json({ error: "Invalid webhook." }, { status: 401 });
  }

  const { event, duplicate } = await recordWebhookEvent({
    provider: provider.name,
    eventId: parsed.eventId,
    type: parsed.type,
    reference: parsed.reference,
    payload: JSON.parse(rawBody),
  });

  // Already recorded — Paystack retries deliveries; acknowledge and stop.
  if (duplicate || !event) return NextResponse.json({ received: true, duplicate: true });

  const actor = { type: "SYSTEM" as const, email: `webhook:${provider.name}` };
  let errorMessage: string | undefined;

  if (parsed.reference && parsed.type.startsWith("charge.")) {
    const result = await settlePayment({ reference: parsed.reference, actor, request });
    if ("error" in result) errorMessage = result.error;
  } else if (parsed.reference && parsed.type.startsWith("refund.")) {
    // Only a refund the provider reports as processed unwinds the sale; a
    // pending or failed refund is recorded and otherwise ignored.
    if (parsed.refund?.confirmed && parsed.refund.amountMinor > 0) {
      const result = await processRefund({
        reference: parsed.reference,
        refundAmountMinor: parsed.refund.amountMinor,
        currency: parsed.refund.currency,
        actor,
        request,
      });
      if ("error" in result) errorMessage = result.error;
    } else {
      errorMessage = `Refund event ${parsed.type} recorded without changing the sale.`;
    }
  }

  await markWebhookProcessed(event.id, errorMessage);

  // Always 200 once the event is stored, so the provider stops retrying.
  return NextResponse.json({ received: true });
}
