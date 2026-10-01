import { prisma } from "@/lib/prisma";
import { logAudit, type ActorType } from "@/lib/audit";
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/statuses";

/**
 * The only supported way to change an application's status. Every transition is
 * recorded in ApplicationStatusHistory (who, when, from, to) and in the audit
 * log, so operational timings can be measured and support questions answered.
 */
export async function changeApplicationStatus(params: {
  applicationId: string;
  newStatus: ApplicationStatus;
  actor: { type: ActorType; id?: string | null; email?: string | null; name?: string | null };
  note?: string | null;
  request?: Request;
}) {
  if (!APPLICATION_STATUSES.includes(params.newStatus)) {
    return { error: "Unknown status." as const };
  }

  const current = await prisma.application.findUnique({
    where: { id: params.applicationId },
    select: { id: true, status: true, trackingId: true },
  });
  if (!current) return { error: "Application not found." as const };
  if (current.status === params.newStatus) return { application: current, unchanged: true as const };

  const now = new Date();
  const [application] = await prisma.$transaction([
    prisma.application.update({
      where: { id: params.applicationId },
      data: { status: params.newStatus, statusChangedAt: now },
    }),
    prisma.applicationStatusHistory.create({
      data: {
        applicationId: params.applicationId,
        oldStatus: current.status,
        newStatus: params.newStatus,
        changedByType: params.actor.type,
        changedById: params.actor.id ?? null,
        changedByName: params.actor.name ?? params.actor.email ?? null,
        note: params.note ?? null,
        createdAt: now,
      },
    }),
  ]);

  await logAudit({
    actor: { type: params.actor.type, id: params.actor.id, email: params.actor.email },
    action: "APPLICATION_STATUS_CHANGED",
    entity: "Application",
    entityId: params.applicationId,
    metadata: { from: current.status, to: params.newStatus, trackingId: current.trackingId },
    request: params.request,
  });

  return { application };
}

export async function getStatusHistory(applicationId: string) {
  return prisma.applicationStatusHistory.findMany({
    where: { applicationId },
    orderBy: { createdAt: "asc" },
  });
}
