import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [received, inReview, processing, completed, totalApplications, totalPartners, newPartners] =
    await Promise.all([
      prisma.application.count({ where: { status: "RECEIVED" } }),
      prisma.application.count({ where: { status: { in: ["UNDER_REVIEW", "DOCUMENTS_REQUIRED"] } } }),
      prisma.application.count({ where: { status: { in: ["PROCESSING", "READY"] } } }),
      prisma.application.count({ where: { status: "COMPLETED" } }),
      prisma.application.count(),
      prisma.partnerApplication.count(),
      prisma.partnerApplication.count({ where: { status: "NEW" } }),
    ]);

  const recentApplications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { customer: true },
  });

  const cards = [
    { label: "New", value: received, href: "/admin/applications" },
    { label: "In Review", value: inReview, href: "/admin/applications" },
    { label: "Processing", value: processing, href: "/admin/applications" },
    { label: "Completed", value: completed, href: "/admin/applications" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-emerald-dark">Overview</h1>
      <p className="mt-1 text-sm text-ink/60">
        {totalApplications} total applications &middot; {totalPartners} partner leads (
        {newPartners} new)
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
              {card.label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-emerald-dark">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-black/5 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
          <h2 className="font-display text-base font-semibold text-emerald-dark">
            Recent Applications
          </h2>
          <Link href="/admin/applications" className="text-xs font-semibold text-emerald hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-black/5">
          {recentApplications.length === 0 && (
            <p className="px-6 py-8 text-sm text-ink/50">No applications yet.</p>
          )}
          {recentApplications.map((app) => (
            <div key={app.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-ink">{app.customer.fullName}</p>
                <p className="text-xs text-ink/50">
                  {app.trackingId} &middot; {app.service.replaceAll("_", " ")}
                </p>
              </div>
              <span className="rounded-full bg-ivory px-3 py-1 text-xs font-semibold text-emerald-dark">
                {app.status.replaceAll("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
