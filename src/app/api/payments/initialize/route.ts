import { NextResponse } from "next/server";
import { z } from "zod";
import { guardRequest } from "@/lib/rateLimit";
import { requireCustomer } from "@/lib/authz";
import { startPayment } from "@/lib/payments/service";
import { SITE_URL } from "@/lib/content/social";

const schema = z.object({ invoiceId: z.string().min(1) });

export async function POST(request: Request) {
  const blocked = guardRequest(request, "payment-initialize", 12, 60 * 60_000);
  if (blocked) return blocked;

  const auth = await requireCustomer(request);
  if (!auth.ok) return auth.response;

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL).replace(/\/$/, "");
  const result = await startPayment({
    invoiceId: parsed.data.invoiceId,
    customerId: auth.actor.id,
    callbackUrl: `${base}/account?payment=return`,
    request,
  });

  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result);
}
