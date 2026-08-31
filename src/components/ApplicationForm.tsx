"use client";

import { useState } from "react";
import Link from "next/link";
import { services } from "@/lib/content/services";
import { applicationSchema } from "@/lib/validation";
import { Field, TextInput, TextArea } from "@/components/form/Field";

const purposes = ["Tourism", "Medical Travel", "Study", "Visiting Family", "Other"];

export default function ApplicationForm({ preselectedService }: { preselectedService?: string }) {
  const [service, setService] = useState(preselectedService ?? services[0].dbValue);
  const [values, setValues] = useState({
    fullName: "",
    nationality: "",
    whatsapp: "",
    email: "",
    travelDate: "",
    travelPurpose: purposes[0],
    additionalInfo: "",
    password: "",
    referralCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [accountCreated, setAccountCreated] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function update<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const parsed = applicationSchema.safeParse({ ...values, service });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setTrackingId(data.trackingId);
      setAccountCreated(Boolean(data.accountCreated));
      setStatus("idle");
    } catch {
      setServerError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  if (trackingId) {
    return (
      <div className="rounded-2xl border border-gold/40 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald/10 text-emerald">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-emerald-dark">
          Application received
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          Your MISR VISA tracking number is:
        </p>
        <p className="mt-3 font-display text-3xl font-semibold tracking-wide text-emerald">
          {trackingId}
        </p>
        <p className="mt-4 text-sm text-ink/60">
          Save this number — you can check your status anytime on the{" "}
          <Link href={`/track?id=${trackingId}`} className="font-semibold text-emerald underline">
            Track Application
          </Link>{" "}
          page. Our team will reach out to the WhatsApp number or email you provided.
        </p>

        <div className="mt-7 border-t border-ink/10 pt-6">
          {accountCreated ? (
            <>
              <p className="text-sm text-ink/70">
                Your account is ready and you&rsquo;re signed in.
              </p>
              <Link
                href="/account"
                className="mt-4 inline-block rounded-full bg-emerald px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-emerald-dark"
              >
                Go to My Dashboard
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm text-ink/70">
                Want all your applications in one place?
              </p>
              <Link
                href="/account/register"
                className="mt-4 inline-block rounded-full border border-emerald px-6 py-3 text-sm font-semibold uppercase tracking-wide text-emerald hover:bg-emerald hover:text-white"
              >
                Set Up an Account
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div>
        <span className="block text-sm font-semibold text-emerald-dark">Choose a service</span>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {services.map((s) => (
            <label
              key={s.dbValue}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition-colors ${
                service === s.dbValue
                  ? "border-emerald bg-emerald/5"
                  : "border-black/10 hover:border-emerald/40"
              }`}
            >
              <input
                type="radio"
                name="service"
                value={s.dbValue}
                checked={service === s.dbValue}
                onChange={() => setService(s.dbValue)}
                className="h-4 w-4 accent-emerald"
              />
              <span className="font-medium text-ink">{s.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Full Name" htmlFor="fullName" error={errors.fullName}>
          <TextInput
            id="fullName"
            value={values.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            required
          />
        </Field>
        <Field label="Nationality" htmlFor="nationality" error={errors.nationality}>
          <TextInput
            id="nationality"
            value={values.nationality}
            onChange={(e) => update("nationality", e.target.value)}
            required
          />
        </Field>
        <Field label="WhatsApp Number" htmlFor="whatsapp" error={errors.whatsapp}>
          <TextInput
            id="whatsapp"
            type="tel"
            value={values.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            placeholder="+234..."
            required
          />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <TextInput
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </Field>
        <Field label="Travel Date" htmlFor="travelDate" optional error={errors.travelDate}>
          <TextInput
            id="travelDate"
            type="date"
            value={values.travelDate}
            onChange={(e) => update("travelDate", e.target.value)}
          />
        </Field>
        <Field label="Travel Purpose" htmlFor="travelPurpose" error={errors.travelPurpose}>
          <select
            id="travelPurpose"
            value={values.travelPurpose}
            onChange={(e) => update("travelPurpose", e.target.value)}
            className="block w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-ink focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
          >
            {purposes.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Additional Information" htmlFor="additionalInfo" optional error={errors.additionalInfo}>
        <TextArea
          id="additionalInfo"
          rows={4}
          value={values.additionalInfo}
          onChange={(e) => update("additionalInfo", e.target.value)}
          placeholder="Anything else we should know?"
        />
      </Field>

      <div className="grid gap-6 rounded-2xl bg-ivory p-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <p className="text-sm font-semibold text-emerald-dark">Create an account (optional)</p>
          <p className="mt-1 text-xs leading-relaxed text-ink/55">
            Set a password to sign in later and see all your applications and their progress in one
            place.
          </p>
        </div>
        <Field label="Password" htmlFor="password" optional error={errors.password}>
          <TextInput
            id="password"
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="At least 8 characters"
          />
        </Field>
        <Field label="Referral Code" htmlFor="referralCode" optional error={errors.referralCode}>
          <TextInput
            id="referralCode"
            value={values.referralCode}
            onChange={(e) => update("referralCode", e.target.value.toUpperCase())}
            placeholder="If an agent referred you"
          />
        </Field>
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-emerald px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:bg-emerald-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting..." : "Submit Application"}
      </button>
      <p className="text-center text-xs text-ink/50">
        By submitting, you agree to be contacted by MISR VISA regarding your application.
      </p>
    </form>
  );
}
