import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { APPLICATION_STATUSES } from "@/lib/statuses";

const updateSchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  notes: z.string().max(4000).optional(),
  assignedStaff: z.string().max(200).optional(),
  amountCharged: z.coerce.number().min(0).nullable().optional(),
});

export async function PATCH(request: Request, { params }: RouteContext<"/api/admin/applications/[id]">) {
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
    const application = await prisma.application.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(application);
  } catch (err) {
    console.error("Failed to update application", err);
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }
}
