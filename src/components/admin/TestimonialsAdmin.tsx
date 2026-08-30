"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface TestimonialRow {
  id: string;
  customerName: string | null;
  countryFlag: string | null;
  quote: string | null;
  isPlaceholder: boolean;
  published: boolean;
}

export default function TestimonialsAdmin({ testimonials }: { testimonials: TestimonialRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(testimonials);
  const [newValues, setNewValues] = useState({ customerName: "", countryFlag: "", quote: "" });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function togglePublished(id: string, published: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });
      if (res.ok) {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, published, isPlaceholder: false } : r)));
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  async function deleteRow(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRows((prev) => prev.filter((r) => r.id !== id));
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  async function addTestimonial(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!newValues.customerName || !newValues.quote) {
      setError("Customer name and quote are required.");
      return;
    }
    const res = await fetch("/api/admin/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newValues, published: true }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not add testimonial.");
      return;
    }
    setRows((prev) => [data, ...prev]);
    setNewValues({ customerName: "", countryFlag: "", quote: "" });
    router.refresh();
  }

  return (
    <div>
      <form onSubmit={addTestimonial} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="font-display text-base font-semibold text-emerald-dark">Add a real testimonial</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input
            placeholder="Customer name"
            value={newValues.customerName}
            onChange={(e) => setNewValues((v) => ({ ...v, customerName: e.target.value }))}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-emerald focus:outline-none"
          />
          <input
            placeholder="Country (optional, e.g. Nigeria)"
            value={newValues.countryFlag}
            onChange={(e) => setNewValues((v) => ({ ...v, countryFlag: e.target.value }))}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-emerald focus:outline-none"
          />
        </div>
        <textarea
          placeholder="Testimonial quote"
          value={newValues.quote}
          onChange={(e) => setNewValues((v) => ({ ...v, quote: e.target.value }))}
          rows={3}
          className="mt-4 block w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-emerald focus:outline-none"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="mt-4 rounded-full bg-emerald px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-dark"
        >
          Add &amp; Publish
        </button>
      </form>

      <div className="mt-6 divide-y divide-black/5 rounded-2xl border border-black/5 bg-white shadow-sm">
        {rows.map((t) => (
          <div key={t.id} className="flex items-start justify-between gap-4 px-6 py-5">
            <div className="flex-1">
              {t.isPlaceholder ? (
                <p className="text-sm italic text-ink/40">Placeholder — no real testimonial yet.</p>
              ) : (
                <>
                  <p className="text-sm text-ink/80">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-1 text-xs text-ink/50">
                    {t.customerName} {t.countryFlag && `· ${t.countryFlag}`}
                  </p>
                </>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {!t.isPlaceholder && (
                <button
                  type="button"
                  disabled={busyId === t.id}
                  onClick={() => togglePublished(t.id, !t.published)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                    t.published ? "bg-emerald/10 text-emerald" : "bg-ivory text-ink/50"
                  }`}
                >
                  {t.published ? "Published" : "Hidden"}
                </button>
              )}
              <button
                type="button"
                disabled={busyId === t.id}
                onClick={() => deleteRow(t.id)}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
