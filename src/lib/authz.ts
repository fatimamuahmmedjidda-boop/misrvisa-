import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getCustomerSession } from "@/lib/customerAuth";
import { getPartnerSession } from "@/lib/partnerAuth";
import { prisma } from "@/lib/prisma";

/**
 * Defence in depth for every protected route.
 *
 * `src/proxy.ts` already blocks unauthenticated requests at the edge, but these
 * helpers repeat the check inside the handler and additionally verify that the
 * account still exists, is still active, and that the session has not been
 * revoked by a password change (sessionVersion).
 */

export const ADMIN_ROLES = ["OWNER", "OPERATIONS", "EDITOR"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export interface AdminContext {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export interface AccountContext {
  id: string;
  email: string;
  name: string;
}

type Guard<T> = { ok: true; actor: T } | { ok: false; response: NextResponse };

const unauthorized = (message = "Unauthorized") =>
  ({ ok: false as const, response: NextResponse.json({ error: message }, { status: 401 }) });

const forbidden = (message = "Forbidden") =>
  ({ ok: false as const, response: NextResponse.json({ error: message }, { status: 403 }) });

/**
 * Rejects cross-site state-changing requests. Cookies are SameSite=Lax, so this
 * is a second barrier rather than the only one.
 */
export function assertSameOrigin(request: Request): NextResponse | null {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return null;

  const origin = request.headers.get("origin");
  if (!origin) return null; // Same-origin form posts and server calls omit it.
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    if (new URL(origin).host !== host) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  } catch {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  return null;
}

function sessionVersionOf(payload: Record<string, string> | null): number {
  const raw = payload?.v;
  const parsed = Number(raw ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Page-level resolvers used by server components. They apply exactly the same
 * rules as the API guards (account exists, is active, session not revoked), so
 * a revoked or disabled session cannot open a dashboard either — the UI is
 * never the security boundary.
 */
export async function getActiveAdmin(allowedRoles?: AdminRole[]): Promise<AdminContext | null> {
  const session = await getAdminSession();
  if (!session) return null;

  const admin = await prisma.adminUser.findUnique({
    where: { id: session.adminId },
    select: { id: true, email: true, name: true, role: true, active: true, sessionVersion: true },
  });

  if (!admin || !admin.active) return null;
  if (admin.sessionVersion !== sessionVersionOf(session)) return null;

  const role = (ADMIN_ROLES as readonly string[]).includes(admin.role) ? (admin.role as AdminRole) : "OWNER";
  if (allowedRoles && !allowedRoles.includes(role)) return null;

  return { id: admin.id, email: admin.email, name: admin.name, role };
}

export async function getActiveCustomer(): Promise<AccountContext | null> {
  const session = await getCustomerSession();
  if (!session) return null;

  const customer = await prisma.customer.findUnique({
    where: { id: session.customerId },
    select: { id: true, email: true, fullName: true, sessionVersion: true },
  });

  if (!customer) return null;
  if (customer.sessionVersion !== sessionVersionOf(session)) return null;

  return { id: customer.id, email: customer.email, name: customer.fullName };
}

export async function getActivePartner(): Promise<AccountContext | null> {
  const session = await getPartnerSession();
  if (!session) return null;

  const partner = await prisma.partner.findUnique({
    where: { id: session.partnerId },
    select: { id: true, email: true, name: true, active: true, sessionVersion: true },
  });

  if (!partner || !partner.active) return null;
  if (partner.sessionVersion !== sessionVersionOf(session)) return null;

  return { id: partner.id, email: partner.email, name: partner.name };
}

export async function requireAdmin(request?: Request, allowedRoles?: AdminRole[]): Promise<Guard<AdminContext>> {
  if (request) {
    const originError = assertSameOrigin(request);
    if (originError) return { ok: false, response: originError };
  }

  const admin = await getActiveAdmin();
  if (!admin) return unauthorized("Your session has expired. Please sign in again.");
  if (allowedRoles && !allowedRoles.includes(admin.role)) {
    return forbidden("Your role does not allow this action.");
  }

  return { ok: true, actor: admin };
}

export async function requireCustomer(request?: Request): Promise<Guard<AccountContext>> {
  if (request) {
    const originError = assertSameOrigin(request);
    if (originError) return { ok: false, response: originError };
  }

  const customer = await getActiveCustomer();
  if (!customer) return unauthorized("Your session has expired. Please sign in again.");
  return { ok: true, actor: customer };
}

export async function requirePartner(request?: Request): Promise<Guard<AccountContext>> {
  if (request) {
    const originError = assertSameOrigin(request);
    if (originError) return { ok: false, response: originError };
  }

  const partner = await getActivePartner();
  if (!partner) return unauthorized("This partner session is no longer valid.");
  return { ok: true, actor: partner };
}

/**
 * Ownership check used by partner/customer routes: never trust an ID from the
 * request without confirming the signed-in account owns that record.
 */
export async function assertApplicationOwnership(
  applicationId: string,
  owner: { customerId?: string; partnerId?: string },
) {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    select: { id: true, customerId: true, partnerId: true },
  });
  if (!application) return null;
  if (owner.customerId && application.customerId !== owner.customerId) return null;
  if (owner.partnerId && application.partnerId !== owner.partnerId) return null;
  return application;
}
