import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { APPLICATION_STATUSES } from "@/lib/statuses";
import { changeApplicationStatus } from "@/lib/applicationStatus";
import { logAudit } from "@/lib/audit";
import { requireAdmin } from "@/lib/authz";

const updateSchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  notes: z.string().max(4000).optional(),
  assignedStaff: z.string().max(200).optional(),
  amountCharged: z.coerce.number().min(0).nullable().optional(),
});

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/applications/[id]">) {
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

  const { status, ...rest } = parsed.data;

  try {
    // Status moves through changeApplicationStatus so the transition is written
    // to ApplicationStatusHistory and the audit log.
    if (status) {
      const result = await changeApplicationStatus({
        applicationId: id,
        newStatus: status,
        actor: { type: "ADMIN", id: auth.actor.id, email: auth.actor.email, name: auth.actor.name },
        request,
      });
      if ("error" in result) return NextResponse.json({ error: result.error }, { status: 404 });
    }

    const application = Object.keys(rest).length
      ? await prisma.application.update({ where: { id }, data: rest })
      : await prisma.application.findUniqueOrThrow({ where: { id } });

    if (Object.keys(rest).length) {
      await logAudit({
        actor: { type: "ADMIN", id: auth.actor.id, email: auth.actor.email },
        action: "APPLICATION_UPDATED",
        entity: "Application",
        entityId: id,
        metadata: { fields: Object.keys(rest) },
        request,
      });
    }

    return NextResponse.json(application);
  } catch (err) {
    console.error("Failed to update application", err);
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }
}
