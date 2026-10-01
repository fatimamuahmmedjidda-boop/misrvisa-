import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PARTNER_STATUSES } from "@/lib/statuses";
import { requireAdmin } from "@/lib/authz";

const updateSchema = z.object({
  status: z.enum(PARTNER_STATUSES),
});

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/partners/[id]">) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }

  try {
    const partner = await prisma.partnerApplication.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(partner);
  } catch (err) {
    console.error("Failed to update partner", err);
    return NextResponse.json({ error: "Partner not found." }, { status: 404 });
  }
}
