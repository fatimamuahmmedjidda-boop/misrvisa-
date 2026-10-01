import { prisma } from "@/lib/prisma";
import PartnersTable from "@/components/admin/PartnersTable";
import type { PartnerStatus } from "@/lib/statuses";

export default async function AdminPartnersPage() {
  const partners = await prisma.partnerApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows = partners.map((p) => ({
    id: p.id,
    companyName: p.companyName,
    contactPerson: p.contactPerson,
    country: p.country,
    phone: p.phone,
    email: p.email,
    businessType: p.businessType,
    expectedVolume: p.expectedVolume,
    message: p.message,
    status: p.status as PartnerStatus,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-emerald-dark">Partner Requests</h1>
      <p className="mt-1 text-sm text-ink/60">{partners.length} total</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <PartnersTable partners={rows} />
      </div>
    </div>
  );
}
