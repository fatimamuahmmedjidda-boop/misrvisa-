import { prisma } from "@/lib/prisma";
import ApplicationsTable from "@/components/admin/ApplicationsTable";
import type { ApplicationStatus } from "@/lib/statuses";

export default async function AdminApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  const rows = applications.map((app) => ({
    id: app.id,
    trackingId: app.trackingId,
    service: app.service,
    status: app.status as ApplicationStatus,
    travelPurpose: app.travelPurpose,
    travelDate: app.travelDate ? app.travelDate.toISOString() : null,
    createdAt: app.createdAt.toISOString(),
    notes: app.notes,
    assignedStaff: app.assignedStaff,
    customer: {
      fullName: app.customer.fullName,
      email: app.customer.email,
      whatsapp: app.customer.whatsapp,
      nationality: app.customer.nationality,
    },
  }));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-emerald-dark">Applications</h1>
      <p className="mt-1 text-sm text-ink/60">{applications.length} total</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        <ApplicationsTable applications={rows} />
      </div>
    </div>
  );
}
