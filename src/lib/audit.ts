import { prisma } from "@/lib/prisma";

export type ActorType = "ADMIN" | "CUSTOMER" | "PARTNER" | "SYSTEM";

export interface AuditActor {
  type: ActorType;
  id?: string | null;
  email?: string | null;
}

/**
 * Writes an audit entry. Auditing must never break the action it records, so
 * failures are logged and swallowed. Never pass secrets or document contents
 * in `metadata`.
 */
export async function logAudit(params: {
  actor: AuditActor;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
  request?: Request;
}) {
  try {
    const ip = params.request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    await prisma.auditLog.create({
      data: {
        actorType: params.actor.type,
        actorId: params.actor.id ?? null,
        actorEmail: params.actor.email ?? null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        metadata: params.metadata ? (params.metadata as object) : undefined,
        ip: ip ?? null,
        userAgent: params.request?.headers.get("user-agent")?.slice(0, 300) ?? null,
      },
    });
  } catch (err) {
    console.error("Audit log write failed", { action: params.action, entity: params.entity, err });
  }
}
