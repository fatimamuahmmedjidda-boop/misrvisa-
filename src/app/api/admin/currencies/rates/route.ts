import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/authz";
import { logAudit } from "@/lib/audit";
import { getCurrentRate, listCurrentRates, publishRate } from "@/lib/currency";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  return NextResponse.json(await listCurrentRates());
}

const rateSchema = z.object({
  quoteCurrency: z.string().trim().length(3).toUpperCase(),
  rate: z.coerce.number().positive().max(10_000_000),
  source: z.string().trim().max(200).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const auth = await requireAdmin(request, ["OWNER"]);
  if (!auth.ok) return auth.response;

  const parsed = rateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid currency and rate." }, { status: 400 });

  const previous = await getCurrentRate(parsed.data.quoteCurrency);
  const rate = await publishRate({
    quoteCurrency: parsed.data.quoteCurrency,
    rate: parsed.data.rate,
    mode: "MANUAL",
    source: parsed.data.source || null,
    actor: { id: auth.actor.id, email: auth.actor.email },
  });

  await logAudit({
    actor: { type: "ADMIN", id: auth.actor.id, email: auth.actor.email },
    action: "EXCHANGE_RATE_CHANGED",
    entity: "ExchangeRate",
    entityId: rate.id,
    metadata: { quoteCurrency: parsed.data.quoteCurrency, from: previous?.rate ?? null, to: parsed.data.rate },
    request,
  });

  return NextResponse.json(rate, { status: 201 });
}
