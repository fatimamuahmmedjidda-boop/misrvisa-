"use client";

import { useState } from "react";

export interface ResetRow {
  id: string;
  email: string;
  userType: string;
  link: string;
  requestedAt: string;
  expiresAt: string;
  expired: boolean;
}

export default function PasswordResetsAdmin({ resets }: { resets: ResetRow[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copy(row: ResetRow) {
    try {
      await navigator.clipboard.writeText(row.link);
      setCopiedId(row.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(null);
    }
  }

  if (resets.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-emerald/20 bg-white p-10 text-center">
        <p className="text-sm text-ink/60">No one is waiting for a password reset right now.</p>
        <p className="mt-2 text-xs text-ink/45">
          When a traveler or partner asks to reset their password, their link appears here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {resets.map((r) => (
        <div
          key={r.id}
          className={`rounded-2xl border bg-white p-5 shadow-sm ${
            r.expired ? "border-black/5 opacity-60" : "border-gold/40"
          }`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <p className="font-medium text-ink">{r.email}</p>
              <p className="text-xs text-ink/50">
                {r.userType === "PARTNER" ? "Partner account" : "Traveler account"} · requested{" "}
                {new Date(r.requestedAt).toLocaleString()}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                r.expired ? "bg-ink/10 text-ink/50" : "bg-gold/20 text-gold-dark"
              }`}
            >
              {r.expired ? "Expired" : `Valid until ${new Date(r.expiresAt).toLocaleTimeString()}`}
            </span>
          </div>

          {!r.expired && (
            <>
              <p className="mt-4 break-all rounded-lg bg-ivory p-3 text-xs text-ink/70">{r.link}</p>
              <button
                type="button"
                onClick={() => copy(r)}
                className="mt-3 rounded-full bg-emerald px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-emerald-dark"
              >
                {copiedId === r.id ? "Copied" : "Copy link"}
              </button>
              <p className="mt-3 text-xs leading-relaxed text-ink/50">
                Send this to {r.email} on WhatsApp or by email. It works once and expires in an
                hour.
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
