import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { logAudit } from "@/lib/audit";
import { listServices } from "@/lib/pricing";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;
  return NextResponse.json(await listServices(false));
}

const serviceSchema = z.object({
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes."),
  name: z.string().trim().min(2).max(200),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  dbValue: z.string().trim().max(80).optional().or(z.literal("")),
  appliesGovernmentFee: z.boolean().default(false),
  appliesQrFee: z.boolean().default(false),
  active: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export async function POST(request: Request) {
  const auth = await requireAdmin(request, ["OWNER"]);
  if (!auth.ok) return auth.response;

  const parsed = serviceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the service details." }, { status: 400 });

  const service = await prisma.service.create({
    data: { ...parsed.data, description: parsed.data.description || null, dbValue: parsed.data.dbValue || null },
  });

  await logAudit({
    actor: { type: "ADMIN", id: auth.actor.id, email: auth.actor.email },
    action: "SERVICE_CREATED",
    entity: "Service",
    entityId: service.id,
    metadata: { slug: service.slug },
    request,
  });

  return NextResponse.json(service, { status: 201 });
}

const updateSchema = serviceSchema.partial().extend({ id: z.string().min(1) });

export async function PATCH(request: Request) {
  const auth = await requireAdmin(request, ["OWNER"]);
  if (!auth.ok) return auth.response;

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid update." }, { status: 400 });

  const { id, ...data } = parsed.data;
  const service = await prisma.service.update({ where: { id }, data });

  await logAudit({
    actor: { type: "ADMIN", id: auth.actor.id, email: auth.actor.email },
    action: "SERVICE_UPDATED",
    entity: "Service",
    entityId: id,
    metadata: data as Record<string, unknown>,
    request,
  });

  return NextResponse.json(service);
}
