import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/authz";
import { logAudit } from "@/lib/audit";
import { getCurrentPrice, getPriceHistory, publishPrice } from "@/lib/pricing";
import { toMinor } from "@/lib/money";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const serviceId = new URL(request.url).searchParams.get("serviceId");
  if (!serviceId) return NextResponse.json({ error: "serviceId is required." }, { status: 400 });
  return NextResponse.json(await getPriceHistory(serviceId));
}

// Amounts arrive as major units (150 = USD 150.00) and are stored as minor units.
const priceSchema = z.object({
  serviceId: z.string().min(1),
  serviceFee: z.coerce.number().min(0).max(1_000_000),
  vipSurcharge: z.coerce.number().min(0).max(1_000_000).default(0),
  governmentFee: z.coerce.number().min(0).max(1_000_000).default(0),
  qrFee: z.coerce.number().min(0).max(1_000_000).default(0),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const auth = await requireAdmin(request, ["OWNER"]);
  if (!auth.ok) return auth.response;

  const parsed = priceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the amounts." }, { status: 400 });

  const previous = await getCurrentPrice(parsed.data.serviceId);
  const price = await publishPrice({
    serviceId: parsed.data.serviceId,
    serviceFeeMinor: toMinor(parsed.data.serviceFee),
    vipSurchargeMinor: toMinor(parsed.data.vipSurcharge),
    governmentFeeMinor: toMinor(parsed.data.governmentFee),
    qrFeeMinor: toMinor(parsed.data.qrFee),
    note: parsed.data.note || null,
    actor: { id: auth.actor.id, email: auth.actor.email },
  });

  await logAudit({
    actor: { type: "ADMIN", id: auth.actor.id, email: auth.actor.email },
    action: "PRICE_CHANGED",
    entity: "ServicePrice",
    entityId: price.id,
    metadata: {
      serviceId: parsed.data.serviceId,
      from: previous
        ? {
            serviceFeeMinor: previous.serviceFeeMinor,
            vipSurchargeMinor: previous.vipSurchargeMinor,
            governmentFeeMinor: previous.governmentFeeMinor,
            qrFeeMinor: previous.qrFeeMinor,
          }
        : null,
      to: {
        serviceFeeMinor: price.serviceFeeMinor,
        vipSurchargeMinor: price.vipSurchargeMinor,
        governmentFeeMinor: price.governmentFeeMinor,
        qrFeeMinor: price.qrFeeMinor,
      },
    },
    request,
  });

  return NextResponse.json(price, { status: 201 });
}
