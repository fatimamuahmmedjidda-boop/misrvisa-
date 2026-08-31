import { prisma } from "@/lib/prisma";
import PasswordResetsAdmin from "@/components/admin/PasswordResetsAdmin";

export default async function AdminPasswordResetsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Tidy up links that were already used or have long since expired.
  await prisma.passwordReset.deleteMany({
    where: {
      OR: [{ usedAt: { not: null } }, { expiresAt: { lt: yesterday } }],
    },
  });

  const resets = await prisma.passwordReset.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const rows = resets.map((r) => ({
    id: r.id,
    email: r.email,
    userType: r.userType,
    link: `${siteUrl}/account/reset?token=${r.token}`,
    requestedAt: r.createdAt.toISOString(),
    expiresAt: r.expiresAt.toISOString(),
    expired: r.expiresAt < now,
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-emerald-dark">Password Resets</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink/60">
        When someone forgets their password, their reset link appears here. Copy it and send it to
        them on WhatsApp or by email.
      </p>

      <div className="mt-6">
        <PasswordResetsAdmin resets={rows} />
      </div>
    </div>
  );
}
