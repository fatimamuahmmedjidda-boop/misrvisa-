"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface PartnerAccountRow {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  commissionPercent: number;
  active: boolean;
  clientCount: number;
  applicationCount: number;
}

export default function PartnerAccountsAdmin({ partners }: { partners: PartnerAccountRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", commissionPercent: "10" });
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function createPartner(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/partner-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create partner.");
        return;
      }
      setNotice(`Partner created. Referral code: ${data.referralCode}`);
      setForm({ name: "", email: "", password: "", commissionPercent: "10" });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function patchPartner(id: string, patch: Record<string, unknown>) {
    await fetch(`/api/admin/partner-accounts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={createPartner}
        className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
      >
        <h2 className="font-display text-lg font-semibold text-emerald-dark">Add a Partner</h2>
        <p className="mt-1 text-xs text-ink/55">
          Partners sign in at <code className="text-emerald">/partner-portal/login</code> and see
          only their own referred clients.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <input
            required
            placeholder="Partner / agency name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-emerald focus:outline-none"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-emerald focus:outline-none"
          />
          <input
            required
            type="text"
            minLength={8}
            placeholder="Temporary password (min 8 chars)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-emerald focus:outline-none"
          />
          <input
            required
            type="number"
            min="0"
            max="100"
            step="0.5"
            placeholder="Commission %"
            value={form.commissionPercent}
            onChange={(e) => setForm({ ...form, commissionPercent: e.target.value })}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-emerald focus:outline-none"
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        {notice && <p className="mt-3 text-sm text-emerald">{notice}</p>}
        <button
          type="submit"
          disabled={saving}
          className="mt-5 rounded-full bg-emerald px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-emerald-dark disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create Partner"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm">
        {partners.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink/50">No partner accounts yet.</p>
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-6 py-3">Partner</th>
                <th className="px-6 py-3">Referral Code</th>
                <th className="px-6 py-3">Clients</th>
                <th className="px-6 py-3">Commission %</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {partners.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-ink/50">{p.email}</p>
                  </td>
                  <td className="px-6 py-4 font-medium tracking-wider text-emerald">
                    {p.referralCode}
                  </td>
                  <td className="px-6 py-4 text-ink/70">{p.applicationCount}</td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      defaultValue={p.commissionPercent}
                      onBlur={(e) =>
                        patchPartner(p.id, { commissionPercent: Number(e.target.value) })
                      }
                      className="w-20 rounded-lg border border-black/10 px-2 py-1.5 text-sm focus:border-emerald focus:outline-none"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => patchPartner(p.id, { active: !p.active })}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        p.active
                          ? "bg-emerald/10 text-emerald-dark"
                          : "bg-ink/10 text-ink/50"
                      }`}
                    >
                      {p.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
