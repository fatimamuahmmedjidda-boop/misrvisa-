"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Field, TextInput } from "@/components/form/Field";

function Inner({
  endpoint,
  fallbackRedirect,
  submitLabel,
  allowedRedirectPrefix,
}: {
  endpoint: string;
  fallbackRedirect: string;
  submitLabel: string;
  allowedRedirectPrefix: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      const from = searchParams.get("from");
      router.replace(from?.startsWith(allowedRedirectPrefix) ? from : fallbackRedirect);
      router.refresh();
    } catch {
      setError("Network error — please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Email" htmlFor="email">
        <TextInput
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="Password" htmlFor="password">
        <TextInput
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-emerald px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-emerald-dark disabled:opacity-60"
      >
        {loading ? "Please wait..." : submitLabel}
      </button>
    </form>
  );
}

export default function AuthForm(props: {
  endpoint: string;
  fallbackRedirect: string;
  submitLabel: string;
  allowedRedirectPrefix: string;
}) {
  return (
    <Suspense fallback={null}>
      <Inner {...props} />
    </Suspense>
  );
}
