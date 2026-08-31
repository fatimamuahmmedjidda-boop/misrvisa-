import { NextResponse } from "next/server";
import { clearPartnerSession } from "@/lib/partnerAuth";

export async function POST() {
  await clearPartnerSession();
  return NextResponse.json({ ok: true });
}
