import { prisma } from "@/lib/prisma";
import PartnerAccountsAdmin from "@/components/admin/PartnerAccountsAdmin";

export default async function AdminPartnerAccountsPage() {
  const partners = await prisma.partner.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true, customers: true } } },
  });

  const rows = partners.map((p) => ({
    id: p.id,
    name: p.name,
    email: p.email,
    referralCode: p.referralCode,
    commissionPercent: p.commissionPercent,
    active: p.active,
    clientCount: p._count.customers,
    applicationCount: p._count.applications,
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-emerald-dark">Partner Accounts</h1>
      <p className="mt-1 text-sm text-ink/60">
        Logins for agents who refer clients to MISR VISA.
      </p>

      <div className="mt-6">
        <PartnerAccountsAdmin partners={rows} />
      </div>
    </div>
  );
}
