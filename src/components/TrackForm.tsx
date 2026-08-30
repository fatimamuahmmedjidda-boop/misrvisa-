"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackSchema } from "@/lib/validation";
import { Field, TextInput } from "@/components/form/Field";
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/lib/statuses";

interface TrackResult {
  trackingId: string;
  service: string;
  status: ApplicationStatus;
  createdAt: string;
}

const statusOrder: ApplicationStatus[] = [
  "RECEIVED",
  "UNDER_REVIEW",
  "DOCUMENTS_REQUIRED",
  "PROCESSING",
  "READY",
  "COMPLETED",
];

export default function TrackForm() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get("id") ?? "");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function lookup(id: string) {
    const parsed = trackSchema.safeParse({ trackingId: id });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter a valid tracking number.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "We couldn't find that tracking number.");
        return;
      }
      setResult(data);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = searchParams.get("id");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- run lookup for a tracking id passed via URL on load
    if (id) lookup(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(trackingId);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="flex-1">
          <Field label="Tracking Number" htmlFor="trackingId" error={error ?? undefined}>
            <TextInput
              id="trackingId"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="MVR-2026-0001"
              required
            />
          </Field>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="h-[42px] shrink-0 self-end rounded-lg bg-emerald px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-emerald-dark disabled:opacity-60"
        >
          {loading ? "Checking..." : "Track"}
        </button>
      </form>

      {result && (
        <div className="mt-10 rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
            Tracking Number
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-emerald-dark">
            {result.trackingId}
          </p>

          <div className="mt-8">
            <div className="flex flex-wrap gap-2">
              {statusOrder.map((s) => {
                const currentIndex = statusOrder.indexOf(result.status);
                const thisIndex = statusOrder.indexOf(s);
                const reached = result.status === "CANCELLED" ? false : thisIndex <= currentIndex;
                return (
                  <span
                    key={s}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                      reached ? "bg-emerald text-white" : "bg-ivory text-ink/40"
                    }`}
                  >
                    {APPLICATION_STATUS_LABELS[s]}
                  </span>
                );
              })}
            </div>
            {result.status === "CANCELLED" && (
              <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                This application has been cancelled. Contact us if you have questions.
              </p>
            )}
          </div>

          <p className="mt-6 text-xs text-ink/50">
            Submitted {new Date(result.createdAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
