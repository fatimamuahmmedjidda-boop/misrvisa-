import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getActivePartner } from "@/lib/authz";
import { serviceName } from "@/lib/content/services";
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/lib/statuses";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Partner Dashboard",
  robots: { index: false, follow: false },
};

export default async function PartnerDashboardPage() {
  // Rejects revoked sessions and deactivated partner accounts, exactly like the
  // partner API guard does.
  const session = await getActivePartner();
  if (!session) redirect("/partner-portal/login");

  const partner = await prisma.partner.findUnique({
    where: { id: session.id },
    include: {
      applications: {
        orderBy: { createdAt: "desc" },
        include: { customer: { select: { fullName: true, nationality: true } } },
      },
    },
  });

  if (!partner) return null;

  const apps = partner.applications;
  const completed = apps.filter((a) => a.status === "COMPLETED");
  const active = apps.filter((a) => !["COMPLETED", "CANCELLED"].includes(a.status));

  const earned = completed.reduce(
    (sum, a) => sum + ((a.amountCharged ?? 0) * partner.commissionPercent) / 100,
    0
  );
  const pending = active.reduce(
    (sum, a) => sum + ((a.amountCharged ?? 0) * partner.commissionPercent) / 100,
    0
  );

  const stats = [
    { label: "Total Clients", value: apps.length },
    { label: "Active", value: active.length },
    { label: "Completed", value: completed.length },
    { label: "Commission Rate", value: `${partner.commissionPercent}%` },
  ];

  return (
    <section className="bg-ivory py-16">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
              Partner Portal
            </span>
            <h1 className="mt-2 font-display text-3xl font-semibold text-emerald-dark">
              {partner.name}
            </h1>
            <p className="mt-2 text-sm text-ink/60">
              Your referral code:{" "}
              <span className="font-semibold tracking-wider text-emerald">
                {partner.referralCode}
              </span>
            </p>
          </div>
          <LogoutButton endpoint="/api/partner-portal/logout" redirectTo="/partner-portal/login" />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{s.label}</p>
              <p className="mt-2 font-display text-3xl font-semibold text-emerald-dark">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald/15 bg-emerald/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald">
              Commission Earned (completed)
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-emerald-dark">
              {earned.toFixed(2)}
            </p>
          </div>
          <div className="rounded-2xl border border-gold/40 bg-gold/10 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-dark">
              Projected (in progress)
            </p>
            <p className="mt-2 font-display text-3xl font-semibold text-emerald-dark">
              {pending.toFixed(2)}
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-ink/50">
          Commission is calculated from amounts recorded by MISR VISA staff on each application.
          Applications without a recorded amount count as zero until staff enter one.
        </p>

        <h2 className="mt-12 font-display text-xl font-semibold text-emerald-dark">Your Clients</h2>

        {apps.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-emerald/20 bg-white p-10 text-center text-sm text-ink/60">
            No clients yet. Share your referral code{" "}
            <span className="font-semibold text-emerald">{partner.referralCode}</span> — clients
            enter it when they apply.
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-black/5 bg-ivory/60">
                <tr className="text-xs uppercase tracking-wide text-ink/50">
                  <th className="px-5 py-3 font-semibold">Tracking No.</th>
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">Service</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Your Commission</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a.id} className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-4 font-medium text-emerald-dark">{a.trackingId}</td>
                    <td className="px-5 py-4 text-ink/75">
                      {a.customer.fullName}
                      <span className="block text-xs text-ink/45">{a.customer.nationality}</span>
                    </td>
                    <td className="px-5 py-4 text-ink/70">{serviceName(a.service)}</td>
                    <td className="px-5 py-4 text-ink/70">
                      {APPLICATION_STATUS_LABELS[a.status as ApplicationStatus] ?? a.status}
                    </td>
                    <td className="px-5 py-4 text-ink/70">
                      {a.amountCharged
                        ? ((a.amountCharged * partner.commissionPercent) / 100).toFixed(2)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
