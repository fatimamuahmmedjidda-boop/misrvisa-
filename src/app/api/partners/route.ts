import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { partnerSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = partnerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    await prisma.partnerApplication.create({
      data: {
        companyName: data.companyName,
        contactPerson: data.contactPerson,
        country: data.country,
        phone: data.phone,
        email: data.email,
        website: data.website || null,
        businessType: data.businessType,
        expectedVolume: data.expectedVolume || null,
        message: data.message || null,
      },
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("Failed to create partner application", err);
    return NextResponse.json(
      { error: "We couldn't submit your request. Please try again shortly." },
      { status: 500 }
    );
  }
}
