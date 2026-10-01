import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";

const patchSchema = z.object({
  commissionPercent: z.coerce.number().min(0).max(100).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/partner-accounts/[id]">) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }

  const partner = await prisma.partner.update({
    where: { id },
    data: parsed.data,
    select: { id: true, commissionPercent: true, active: true },
  });

  return NextResponse.json(partner);
}

export async function DELETE(request: Request, { params }: RouteContext<"/api/admin/partner-accounts/[id]">) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;

  const [apps, customers] = await Promise.all([
    prisma.application.count({ where: { partnerId: id } }),
    prisma.customer.count({ where: { referredByPartnerId: id } }),
  ]);

  if (apps > 0 || customers > 0) {
    return NextResponse.json(
      {
        error:
          "This partner has linked applications or customers. Deactivate them instead of deleting, so referral history stays intact.",
      },
      { status: 409 }
    );
  }

  await prisma.partner.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
