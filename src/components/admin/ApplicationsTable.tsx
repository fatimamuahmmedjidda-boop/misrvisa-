"use client";

import { Fragment, useState } from "react";
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/lib/statuses";

export interface ApplicationRow {
  id: string;
  trackingId: string;
  service: string;
  status: ApplicationStatus;
  travelPurpose: string;
  travelDate: string | null;
  createdAt: string;
  notes: string | null;
  assignedStaff: string | null;
  amountCharged: number | null;
  partnerName: string | null;
  customer: { fullName: string; email: string; whatsapp: string; nationality: string };
}

export default function ApplicationsTable({ applications }: { applications: ApplicationRow[] }) {
  const [rows, setRows] = useState(applications);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function updateApplication(
    id: string,
    patch: Partial<{
      status: ApplicationStatus;
      notes: string;
      assignedStaff: string;
      amountCharged: number | null;
    }>
  ) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
      }
    } finally {
      setSavingId(null);
    }
  }

  if (rows.length === 0) {
    return <p className="px-6 py-10 text-center text-sm text-ink/50">No applications yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-ink/50">
          <tr>
            <th className="px-6 py-3">Tracking</th>
            <th className="px-6 py-3">Customer</th>
            <th className="px-6 py-3">Service</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Submitted</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {rows.map((app) => (
            <Fragment key={app.id}>
              <tr className="align-top">
                <td className="px-6 py-4 font-medium text-emerald-dark">{app.trackingId}</td>
                <td className="px-6 py-4">
                  <p className="font-medium text-ink">{app.customer.fullName}</p>
                  <p className="text-xs text-ink/50">{app.customer.email}</p>
                </td>
                <td className="px-6 py-4 text-ink/70">{app.service.replaceAll("_", " ")}</td>
                <td className="px-6 py-4">
                  <select
                    value={app.status}
                    disabled={savingId === app.id}
                    onChange={(e) => updateApplication(app.id, { status: e.target.value as ApplicationStatus })}
                    className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium focus:border-emerald focus:outline-none"
                  >
                    {APPLICATION_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {APPLICATION_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-xs text-ink/50">
                  {new Date(app.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                    className="text-xs font-semibold text-emerald hover:underline"
                  >
                    {expandedId === app.id ? "Close" : "Details"}
                  </button>
                </td>
              </tr>
              {expandedId === app.id && (
                <tr>
                  <td colSpan={6} className="bg-ivory px-6 py-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="text-sm text-ink/70">
                        <p>
                          <span className="font-medium text-ink">WhatsApp:</span> {app.customer.whatsapp}
                        </p>
                        <p className="mt-1">
                          <span className="font-medium text-ink">Nationality:</span>{" "}
                          {app.customer.nationality}
                        </p>
                        <p className="mt-1">
                          <span className="font-medium text-ink">Travel Purpose:</span>{" "}
                          {app.travelPurpose}
                        </p>
                        {app.travelDate && (
                          <p className="mt-1">
                            <span className="font-medium text-ink">Travel Date:</span>{" "}
                            {new Date(app.travelDate).toLocaleDateString()}
                          </p>
                        )}
                        <p className="mt-1">
                          <span className="font-medium text-ink">Referred by:</span>{" "}
                          {app.partnerName ?? "—"}
                        </p>
                        <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-ink/50">
                          Amount Charged (for partner commission)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          defaultValue={app.amountCharged ?? ""}
                          onBlur={(e) =>
                            updateApplication(app.id, {
                              amountCharged: e.target.value === "" ? null : Number(e.target.value),
                            })
                          }
                          className="mt-1 block w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:border-emerald focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                          Assigned Staff
                        </label>
                        <input
                          defaultValue={app.assignedStaff ?? ""}
                          onBlur={(e) => updateApplication(app.id, { assignedStaff: e.target.value })}
                          className="mt-1 block w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:border-emerald focus:outline-none"
                        />
                        <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-ink/50">
                          Internal Notes
                        </label>
                        <textarea
                          defaultValue={app.notes ?? ""}
                          onBlur={(e) => updateApplication(app.id, { notes: e.target.value })}
                          rows={3}
                          className="mt-1 block w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:border-emerald focus:outline-none"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
