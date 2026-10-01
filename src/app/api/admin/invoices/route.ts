import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { logAudit } from "@/lib/audit";
import { createInvoiceForApplication } from "@/lib/invoice";
import { changeApplicationStatus } from "@/lib/applicationStatus";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      customer: { select: { fullName: true, email: true } },
      application: { select: { trackingId: true } },
      payments: { select: { status: true, paidAt: true } },
    },
  });
  return NextResponse.json(invoices);
}

const createSchema = z.object({
  applicationId: z.string().min(1),
  serviceLevel: z.enum(["STANDARD", "VIP"]).default("STANDARD"),
  chargeCurrency: z.string().trim().length(3).toUpperCase().default("USD"),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const auth = await requireAdmin(request, ["OWNER", "OPERATIONS"]);
  if (!auth.ok) return auth.response;

  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid invoice request." }, { status: 400 });

  const result = await createInvoiceForApplication({
    applicationId: parsed.data.applicationId,
    serviceLevel: parsed.data.serviceLevel,
    chargeCurrency: parsed.data.chargeCurrency,
    notes: parsed.data.notes || null,
    createdBy: { type: "ADMIN", id: auth.actor.id },
  });

  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  await changeApplicationStatus({
    applicationId: parsed.data.applicationId,
    newStatus: "PAYMENT_PENDING",
    actor: { type: "ADMIN", id: auth.actor.id, email: auth.actor.email, name: auth.actor.name },
    note: `Invoice ${result.invoice.number} issued.`,
    request,
  });

  await logAudit({
    actor: { type: "ADMIN", id: auth.actor.id, email: auth.actor.email },
    action: "INVOICE_CREATED",
    entity: "Invoice",
    entityId: result.invoice.id,
    metadata: { number: result.invoice.number, totalUsdMinor: result.invoice.totalUsdMinor },
    request,
  });

  return NextResponse.json(result.invoice, { status: 201 });
}
