import { prisma } from "@/lib/prisma";

/**
 * Tracking numbers look like MVR-2026-0001. The sequence resets each calendar
 * year and is derived from how many applications already exist for that year,
 * so it stays correct even after data changes without a separate counter table.
 */
export async function generateTrackingId(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.application.count({
    where: {
      trackingId: {
        startsWith: `MVR-${year}-`,
      },
    },
  });
  const next = String(count + 1).padStart(4, "0");
  return `MVR-${year}-${next}`;
}
