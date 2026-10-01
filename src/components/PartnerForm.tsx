"use client";

import { useState } from "react";
import { partnerSchema } from "@/lib/validation";
import { Field, TextInput, TextArea } from "@/components/form/Field";
import CountryPicker from "@/components/form/CountryPicker";

const initial = {
  companyName: "",
  contactPerson: "",
  country: "",
  phone: "",
  email: "",
  website: "",
  businessType: "",
  expectedVolume: "",
  message: "",
};

export default function PartnerForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "success">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  function update<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const parsed = partnerSchema.safeParse(values);
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
      const res = await fetch("/api/partners", {
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
      setStatus("success");
    } catch {
      setServerError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald/10 text-emerald">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="mt-5 font-display text-2xl font-semibold text-emerald-dark">
          Thanks for reaching out
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          Our partnerships team has received your details and will follow up shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Company / Agency Name" htmlFor="companyName" error={errors.companyName}>
          <TextInput
            id="companyName"
            value={values.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            required
          />
        </Field>
        <Field label="Contact Person" htmlFor="contactPerson" error={errors.contactPerson}>
          <TextInput
            id="contactPerson"
            value={values.contactPerson}
            onChange={(e) => update("contactPerson", e.target.value)}
            required
          />
        </Field>
        <Field label="Country" htmlFor="country" error={errors.country}>
          <CountryPicker
            id="country"
            mode="country"
            value={values.country}
            onChange={(v) => update("country", v)}
            required
          />
        </Field>
        <Field label="Phone / WhatsApp" htmlFor="phone" error={errors.phone}>
          <TextInput
            id="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => update("phone", e.target.value)}
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
        <Field label="Website / Social Media" htmlFor="website" optional error={errors.website}>
          <TextInput
            id="website"
            value={values.website}
            onChange={(e) => update("website", e.target.value)}
          />
        </Field>
        <Field label="Type of Business" htmlFor="businessType" error={errors.businessType}>
          <TextInput
            id="businessType"
            placeholder="Travel agency, medical facilitator, study-abroad agency..."
            value={values.businessType}
            onChange={(e) => update("businessType", e.target.value)}
            required
          />
        </Field>
        <Field label="Number of Travelers / Expected Volume" htmlFor="expectedVolume" optional error={errors.expectedVolume}>
          <TextInput
            id="expectedVolume"
            value={values.expectedVolume}
            onChange={(e) => update("expectedVolume", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Message" htmlFor="message" optional error={errors.message}>
        <TextArea
          id="message"
          rows={4}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
        />
      </Field>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-emerald px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-all hover:bg-emerald-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting..." : "Submit Partnership Request"}
      </button>
    </form>
  );
}
