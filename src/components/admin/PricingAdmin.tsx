"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, TextInput } from "@/components/form/Field";
import { formatMoney, fromMinor } from "@/lib/money";

interface PriceSnapshot {
  serviceFeeMinor: number;
  vipSurchargeMinor: number;
  governmentFeeMinor: number;
  qrFeeMinor: number;
  effectiveFrom: string;
  createdByEmail: string | null;
}

interface ServiceRow {
  id: string;
  slug: string;
  name: string;
  active: boolean;
  appliesGovernmentFee: boolean;
  appliesQrFee: boolean;
  price: PriceSnapshot | null;
}

interface RateRow {
  id: string;
  quoteCurrency: string;
  rate: number;
  mode: string;
  source: string | null;
  effectiveFrom: string;
  createdByEmail: string | null;
}

interface HistoryRow {
  id: string;
  service: string;
  serviceFeeMinor: number;
  vipSurchargeMinor: number;
  governmentFeeMinor: number;
  qrFeeMinor: number;
  effectiveFrom: string;
  effectiveTo: string | null;
  createdByEmail: string | null;
}

/**
 * Pricing & currencies control centre. Publishing a price or a rate creates a
 * new version — nothing is overwritten, so past invoices stay explainable.
 */
export default function PricingAdmin({
  services,
  rates,
  currencies,
  history,
}: {
  services: ServiceRow[];
  rates: RateRow[];
  currencies: { code: string; name: string; symbol: string; active: boolean }[];
  history: HistoryRow[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function post(url: string, body: unknown, successText: string) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ tone: "error", text: data.error ?? "That did not work. Please try again." });
        return false;
      }
      setMessage({ tone: "ok", text: successText });
      setEditing(null);
      router.refresh();
      return true;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-semibold text-emerald-dark">Pricing &amp; currencies</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink/60">
          Change business values here — no developer needed. Every change is versioned and written to the audit log, and
          invoices already issued keep the price and exchange rate that applied when they were created.
        </p>
      </div>

      {message && (
        <p
          className={`rounded-xl px-4 py-3 text-sm ${
            message.tone === "ok" ? "bg-emerald/10 text-emerald" : "bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      <section>
        <h2 className="font-display text-lg font-semibold text-emerald-dark">Services &amp; prices (USD base)</h2>
        {services.length === 0 && (
          <p className="mt-3 rounded-xl border border-black/5 bg-white p-6 text-sm text-ink/55">
            No services configured yet. Run the pricing seed script, then refresh.
          </p>
        )}
        <div className="mt-3 space-y-3">
          {services.map((service) => (
            <div key={service.id} className="rounded-xl border border-black/5 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-emerald-dark">
                    {service.name}
                    {!service.active && <span className="ml-2 text-xs font-normal text-ink/40">(inactive)</span>}
                  </h3>
                  <p className="text-xs text-ink/50">
                    {service.slug}
                    {service.appliesGovernmentFee && " · government fee applies"}
                    {service.appliesQrFee && " · QR fee applies"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(editing === service.id ? null : service.id)}
                  className="rounded-full border border-emerald px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald hover:bg-emerald hover:text-white"
                >
                  {editing === service.id ? "Cancel" : "Change price"}
                </button>
              </div>

              {service.price ? (
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
                  {[
                    ["MISR VISA fee", service.price.serviceFeeMinor],
                    ["VIP surcharge", service.price.vipSurchargeMinor],
                    ["Government fee", service.price.governmentFeeMinor],
                    ["QR code fee", service.price.qrFeeMinor],
                  ].map(([label, minor]) => (
                    <div key={label as string} className="rounded-lg bg-ivory px-3 py-2">
                      <dt className="text-[11px] uppercase tracking-wide text-ink/45">{label}</dt>
                      <dd className="font-display text-lg text-emerald-dark">{formatMoney(minor as number, "USD")}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-3 text-sm text-ink/55">No price published yet for this service.</p>
              )}

              {service.price && (
                <p className="mt-2 text-[11px] text-ink/40">
                  In force since {new Date(service.price.effectiveFrom).toLocaleString()}
                  {service.price.createdByEmail ? ` · set by ${service.price.createdByEmail}` : ""}
                </p>
              )}

              {editing === service.id && (
                <form
                  className="mt-5 grid gap-4 border-t border-black/5 pt-5 sm:grid-cols-2"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = new FormData(e.currentTarget);
                    await post(
                      "/api/admin/pricing/prices",
                      {
                        serviceId: service.id,
                        serviceFee: form.get("serviceFee"),
                        vipSurcharge: form.get("vipSurcharge"),
                        governmentFee: form.get("governmentFee"),
                        qrFee: form.get("qrFee"),
                        note: form.get("note"),
                      },
                      `New price published for ${service.name}.`,
                    );
                  }}
                >
                  <Field label="MISR VISA service fee (USD)" htmlFor={`fee-${service.id}`}>
                    <TextInput
                      id={`fee-${service.id}`}
                      name="serviceFee"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      defaultValue={service.price ? fromMinor(service.price.serviceFeeMinor) : 0}
                    />
                  </Field>
                  <Field label="VIP surcharge (USD)" htmlFor={`vip-${service.id}`}>
                    <TextInput
                      id={`vip-${service.id}`}
                      name="vipSurcharge"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={service.price ? fromMinor(service.price.vipSurchargeMinor) : 0}
                    />
                  </Field>
                  <Field label="Government arrival fee (USD)" htmlFor={`gov-${service.id}`}>
                    <TextInput
                      id={`gov-${service.id}`}
                      name="governmentFee"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={service.price ? fromMinor(service.price.governmentFeeMinor) : 0}
                    />
                  </Field>
                  <Field label="QR code fee (USD)" htmlFor={`qr-${service.id}`}>
                    <TextInput
                      id={`qr-${service.id}`}
                      name="qrFee"
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={service.price ? fromMinor(service.price.qrFeeMinor) : 0}
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Note (why is it changing?)" htmlFor={`note-${service.id}`} optional>
                      <TextInput id={`note-${service.id}`} name="note" maxLength={500} />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={busy}
                      className="rounded-full bg-emerald px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-emerald-dark disabled:opacity-60"
                    >
                      {busy ? "Publishing…" : "Publish new price"}
                    </button>
                    <p className="mt-2 text-xs text-ink/50">
                      The current price is closed and kept in history. Existing invoices are not affected.
                    </p>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-emerald-dark">Exchange rates (1 USD = …)</h2>
        <p className="mt-1 text-sm text-ink/60">
          Display conversions only. These are your own configured rates, not an official bank or government rate.
        </p>

        <div className="mt-3 overflow-x-auto rounded-xl border border-black/5 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-ivory text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Currency</th>
                <th className="px-4 py-3">Rate</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {rates.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-sm text-ink/55">
                    No rates configured yet.
                  </td>
                </tr>
              )}
              {rates.map((rate) => (
                <tr key={rate.id}>
                  <td className="px-4 py-3 font-medium text-emerald-dark">{rate.quoteCurrency}</td>
                  <td className="px-4 py-3">{rate.rate.toLocaleString()}</td>
                  <td className="px-4 py-3 text-ink/60">{rate.mode}</td>
                  <td className="px-4 py-3 text-ink/60">{new Date(rate.effectiveFrom).toLocaleString()}</td>
                  <td className="px-4 py-3 text-ink/60">{rate.createdByEmail ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form
          className="mt-4 grid gap-4 rounded-xl border border-black/5 bg-white p-5 sm:grid-cols-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            await post(
              "/api/admin/currencies/rates",
              { quoteCurrency: form.get("quoteCurrency"), rate: form.get("rate"), source: form.get("source") },
              "Exchange rate updated.",
            );
          }}
        >
          <Field label="Currency" htmlFor="quoteCurrency">
            <select
              id="quoteCurrency"
              name="quoteCurrency"
              required
              className="block w-full rounded-lg border border-black/10 bg-white px-4 py-2.5 text-sm text-ink focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
            >
              {currencies
                .filter((c) => c.code !== "USD")
                .map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name}
                  </option>
                ))}
            </select>
          </Field>
          <Field label="1 USD =" htmlFor="rate">
            <TextInput id="rate" name="rate" type="number" step="0.000001" min="0" required />
          </Field>
          <Field label="Source" htmlFor="source" optional>
            <TextInput id="source" name="source" placeholder="e.g. bureau de change, 26 Sep" />
          </Field>
          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-emerald px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-emerald-dark disabled:opacity-60"
            >
              {busy ? "Saving…" : "Publish rate"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-emerald-dark">Price history</h2>
        <div className="mt-3 overflow-x-auto rounded-xl border border-black/5 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-ivory text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">MISR VISA</th>
                <th className="px-4 py-3">VIP</th>
                <th className="px-4 py-3">Government</th>
                <th className="px-4 py-3">QR</th>
                <th className="px-4 py-3">Period</th>
                <th className="px-4 py-3">By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {history.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-sm text-ink/55">
                    No price versions yet.
                  </td>
                </tr>
              )}
              {history.map((h) => (
                <tr key={h.id}>
                  <td className="px-4 py-3">{h.service}</td>
                  <td className="px-4 py-3">{formatMoney(h.serviceFeeMinor, "USD")}</td>
                  <td className="px-4 py-3">{formatMoney(h.vipSurchargeMinor, "USD")}</td>
                  <td className="px-4 py-3">{formatMoney(h.governmentFeeMinor, "USD")}</td>
                  <td className="px-4 py-3">{formatMoney(h.qrFeeMinor, "USD")}</td>
                  <td className="px-4 py-3 text-xs text-ink/60">
                    {new Date(h.effectiveFrom).toLocaleDateString()} →{" "}
                    {h.effectiveTo ? new Date(h.effectiveTo).toLocaleDateString() : "now"}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink/60">{h.createdByEmail ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
