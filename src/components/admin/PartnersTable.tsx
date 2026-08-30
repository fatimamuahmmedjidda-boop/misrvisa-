"use client";

import { useState } from "react";
import { PARTNER_STATUSES, PARTNER_STATUS_LABELS, type PartnerStatus } from "@/lib/statuses";

export interface PartnerRow {
  id: string;
  companyName: string;
  contactPerson: string;
  country: string;
  phone: string;
  email: string;
  businessType: string;
  expectedVolume: string | null;
  message: string | null;
  status: PartnerStatus;
  createdAt: string;
}

export default function PartnersTable({ partners }: { partners: PartnerRow[] }) {
  const [rows, setRows] = useState(partners);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: PartnerStatus) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      }
    } finally {
      setSavingId(null);
    }
  }

  if (rows.length === 0) {
    return <p className="px-6 py-10 text-center text-sm text-ink/50">No partner requests yet.</p>;
  }

  return (
    <div className="divide-y divide-black/5">
      {rows.map((p) => (
        <div key={p.id} className="px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-ink">{p.companyName}</p>
              <p className="text-xs text-ink/50">
                {p.contactPerson} &middot; {p.country} &middot; {p.businessType}
              </p>
              <p className="mt-1 text-xs text-ink/50">
                {p.email} &middot; {p.phone}
              </p>
              {p.expectedVolume && (
                <p className="mt-1 text-xs text-ink/50">Volume: {p.expectedVolume}</p>
              )}
              {p.message && <p className="mt-2 max-w-xl text-sm text-ink/70">{p.message}</p>}
            </div>
            <select
              value={p.status}
              disabled={savingId === p.id}
              onChange={(e) => updateStatus(p.id, e.target.value as PartnerStatus)}
              className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs font-medium focus:border-emerald focus:outline-none"
            >
              {PARTNER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {PARTNER_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
