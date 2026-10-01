import { NextResponse } from "next/server";
import { guardRequest } from "@/lib/rateLimit";
import { requireCustomer } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

/**
 * "I forgot my tracking number" — only ever answered for a signed-in account.
 * There is deliberately no unauthenticated version: knowing an email address
 * must never reveal applications, travel details or documents.
 */
export async function GET(request: Request) {
  const blocked = guardRequest(request, "account-recover", 20, 60 * 60_000);
  if (blocked) return blocked;

  const auth = await requireCustomer(request);
  if (!auth.ok) return auth.response;

  const applications = await prisma.application.findMany({
    where: { customerId: auth.actor.id },
    orderBy: { createdAt: "desc" },
    select: { trackingId: true, service: true, status: true, createdAt: true },
  });

  return NextResponse.json({ applications });
}
