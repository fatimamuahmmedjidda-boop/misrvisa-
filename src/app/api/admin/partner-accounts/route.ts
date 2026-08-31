import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { adminPartnerSchema } from "@/lib/validation";

function makeReferralCode(name: string) {
  const base = name.replace(/[^a-zA-Z]/g, "").slice(0, 6).toUpperCase() || "PARTNER";
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${suffix}`;
}

export async function GET() {
  const partners = await prisma.partner.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      referralCode: true,
      commissionPercent: true,
      active: true,
      createdAt: true,
      _count: { select: { applications: true, customers: true } },
    },
  });
  return NextResponse.json(partners);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = adminPartnerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.partner.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: "A partner with that email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  let partner;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      partner = await prisma.partner.create({
        data: {
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash,
          commissionPercent: parsed.data.commissionPercent,
          referralCode: makeReferralCode(parsed.data.name),
        },
        select: {
          id: true,
          name: true,
          email: true,
          referralCode: true,
          commissionPercent: true,
          active: true,
          createdAt: true,
        },
      });
      break;
    } catch {
      if (attempt === 4) {
        return NextResponse.json({ error: "Could not create partner." }, { status: 500 });
      }
    }
  }

  return NextResponse.json(partner, { status: 201 });
}
