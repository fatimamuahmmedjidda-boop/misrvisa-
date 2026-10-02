"use client";

import { useState } from "react";
import { Field, TextInput } from "@/components/form/Field";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/content/social";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/account/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Network error — please try again.");
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald/20 bg-white p-7 text-center shadow-sm">
        <h2 className="font-display text-xl font-semibold text-emerald-dark">Request received</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">
          If an account exists for <span className="font-medium text-ink">{email}</span>, we&rsquo;ve
          emailed a reset link to that address. It works once and expires in 60 minutes — remember to
          check your spam folder.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink/60">
          Didn&rsquo;t receive it? Message us on WhatsApp at{" "}
          <span className="font-medium text-emerald">{WHATSAPP_NUMBER}</span> or email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-emerald underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Your email address" htmlFor="email">
        <TextInput
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="The email you signed up with"
        />
      </Field>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-emerald px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-emerald-dark disabled:opacity-60"
      >
        {loading ? "Sending..." : "Request Reset Link"}
      </button>
    </form>
  );
}
