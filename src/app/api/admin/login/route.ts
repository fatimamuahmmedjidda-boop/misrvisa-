import { guardRequest } from "@/lib/rateLimit";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/validation";
import { createAdminSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  const blocked = guardRequest(request, "admin-login", 5, 15 * 60_000);
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  const { email, password } = parsed.data;

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    // Same generic message as a wrong password, so we don't reveal which
    // emails have an account.
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (!admin.active) {
    return NextResponse.json({ error: "This admin account is disabled." }, { status: 403 });
  }

  await prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });

  await createAdminSession({
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    v: String(admin.sessionVersion),
  });

  await logAudit({
    actor: { type: "ADMIN", id: admin.id, email: admin.email },
    action: "ADMIN_SIGNED_IN",
    entity: "AdminUser",
    entityId: admin.id,
    request,
  });

  return NextResponse.json({ ok: true });
}
