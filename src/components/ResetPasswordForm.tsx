"use client";

import { useState } from "react";
import Link from "next/link";
import { Field, TextInput } from "@/components/form/Field";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState<null | "CUSTOMER" | "PARTNER">(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      setDone(data.userType === "PARTNER" ? "PARTNER" : "CUSTOMER");
    } catch {
      setError("Network error — please try again.");
      setLoading(false);
    }
  }

  if (done) {
    const loginHref = done === "PARTNER" ? "/partner-portal/login" : "/account/login";
    return (
      <div className="rounded-2xl border border-emerald/20 bg-white p-7 text-center shadow-sm">
        <h2 className="font-display text-xl font-semibold text-emerald-dark">Password updated</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          You can now sign in with your new password.
        </p>
        <Link
          href={loginHref}
          className="mt-6 inline-block rounded-full bg-emerald px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-emerald-dark"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="New password" htmlFor="password">
        <TextInput
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />
      </Field>
      <Field label="Type it again" htmlFor="confirm">
        <TextInput
          id="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </Field>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-emerald px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-emerald-dark disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save New Password"}
      </button>
    </form>
  );
}
