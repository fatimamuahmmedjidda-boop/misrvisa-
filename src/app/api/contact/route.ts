import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await prisma.contactMessage.create({ data: parsed.data });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Failed to save contact message", err);
    return NextResponse.json(
      { error: "We couldn't send your message. Please try again shortly." },
      { status: 500 }
    );
  }
}
