import { randomInt } from "crypto";
import { prisma } from "@/lib/prisma";

// Unambiguous alphabet: no O/0, I/1, S/5 — travelers read these over the phone.
const ALPHABET = "ABCDEFGHJKLMNPQRTUVWXYZ2346789";

function randomSuffix(length = 6) {
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return out;
}

/**
 * Tracking numbers look like MVR-2026-X7K2QD. The random suffix means one
 * tracking number can never be used to guess another (the old sequential
 * MVR-2026-0001 numbers still work for existing applications).
 */
export async function generateTrackingId(): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 6; attempt++) {
    const candidate = `MVR-${year}-${randomSuffix()}`;
    const existing = await prisma.application.findUnique({
      where: { trackingId: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  // Astronomically unlikely; widen the space rather than fail the application.
  return `MVR-${year}-${randomSuffix(10)}`;
}
