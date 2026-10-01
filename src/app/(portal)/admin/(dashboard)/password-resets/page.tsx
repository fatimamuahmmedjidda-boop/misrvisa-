import { prisma } from "@/lib/prisma";
import { getActiveAdmin } from "@/lib/authz";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Staff can see WHO asked for a reset and whether the link is still valid —
 * never the link itself. Reset links exist only in the email sent to the
 * account holder; the database stores a one-way hash.
 */
export default async function AdminPasswordResetsPage() {
  const admin = await getActiveAdmin();
  if (!admin) redirect("/admin/login");

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // Tidy up links that were already used or have long since expired.
  await prisma.passwordReset.deleteMany({
    where: { OR: [{ usedAt: { not: null } }, { expiresAt: { lt: yesterday } }] },
  });

  const resets = await prisma.passwordReset.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: { id: true, email: true, userType: true, createdAt: true, expiresAt: true, usedAt: true },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-emerald-dark">Password Resets</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink/60">
        Reset links are emailed directly to the account holder. For security, nobody at MISR VISA — including
        administrators — can see or resend a reset link. If someone did not receive theirs, ask them to request it again
        and to check their spam folder.
      </p>

      {resets.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-emerald/20 bg-white p-10 text-center">
          <p className="text-sm text-ink/60">No one is waiting for a password reset right now.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-ivory text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Account</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Requested</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {resets.map((r) => {
                const expired = r.expiresAt < now;
                const label = r.usedAt ? "Used" : expired ? "Expired" : "Link sent by email";
                const tone = r.usedAt
                  ? "bg-emerald/10 text-emerald"
                  : expired
                    ? "bg-ink/10 text-ink/50"
                    : "bg-gold/20 text-gold-dark";
                return (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-medium text-ink">{r.email}</td>
                    <td className="px-4 py-3 text-ink/60">
                      {r.userType === "PARTNER" ? "Partner" : "Traveler"}
                    </td>
                    <td className="px-4 py-3 text-ink/60">{r.createdAt.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
