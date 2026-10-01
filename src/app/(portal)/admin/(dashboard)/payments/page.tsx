import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  SUCCESS: "bg-emerald/10 text-emerald",
  PAID: "bg-emerald/10 text-emerald",
  PENDING: "bg-gold/20 text-gold-dark",
  PROCESSING: "bg-gold/20 text-gold-dark",
  ISSUED: "bg-gold/20 text-gold-dark",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-black/10 text-ink/60",
  REFUNDED: "bg-black/10 text-ink/60",
};

export default async function AdminPaymentsPage() {
  const [invoices, payments, commissions] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { customer: { select: { fullName: true } }, application: { select: { trackingId: true } } },
    }),
    prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { application: { select: { trackingId: true } } },
    }),
    prisma.commission.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { partner: { select: { name: true } }, application: { select: { trackingId: true } } },
    }),
  ]);

  const Badge = ({ value }: { value: string }) => (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[value] ?? "bg-black/10 text-ink/60"}`}>
      {value}
    </span>
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-2xl font-semibold text-emerald-dark">Payments &amp; invoices</h1>
        <p className="mt-1 text-sm text-ink/60">Live records from the database. Amounts are stored in minor units.</p>
      </div>

      <section>
        <h2 className="font-display text-lg font-semibold text-emerald-dark">Invoices</h2>
        {invoices.length === 0 ? (
          <p className="mt-3 rounded-xl border border-black/5 bg-white p-6 text-sm text-ink/55">No invoices yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-black/5 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-ivory text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Application</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Charged</th>
                  <th className="px-4 py-3">USD</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {invoices.map((i) => (
                  <tr key={i.id}>
                    <td className="px-4 py-3 font-medium text-emerald-dark">{i.number}</td>
                    <td className="px-4 py-3">{i.application.trackingId}</td>
                    <td className="px-4 py-3">{i.customer.fullName}</td>
                    <td className="px-4 py-3">{formatMoney(i.totalChargeMinor, i.chargeCurrency)}</td>
                    <td className="px-4 py-3">{formatMoney(i.totalUsdMinor, "USD")}</td>
                    <td className="px-4 py-3"><Badge value={i.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-emerald-dark">Payments</h2>
        {payments.length === 0 ? (
          <p className="mt-3 rounded-xl border border-black/5 bg-white p-6 text-sm text-ink/55">No payments yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-black/5 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-ivory text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Application</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Paid at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-mono text-xs">{p.providerReference}</td>
                    <td className="px-4 py-3">{p.application.trackingId}</td>
                    <td className="px-4 py-3">{p.provider}</td>
                    <td className="px-4 py-3">{formatMoney(p.amountMinor, p.currency)}</td>
                    <td className="px-4 py-3"><Badge value={p.status} /></td>
                    <td className="px-4 py-3 text-ink/60">{p.paidAt ? p.paidAt.toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-emerald-dark">Partner commissions</h2>
        {commissions.length === 0 ? (
          <p className="mt-3 rounded-xl border border-black/5 bg-white p-6 text-sm text-ink/55">No commissions yet.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-black/5 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-ivory text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-4 py-3">Partner</th>
                  <th className="px-4 py-3">Application</th>
                  <th className="px-4 py-3">Sale</th>
                  <th className="px-4 py-3">Rate</th>
                  <th className="px-4 py-3">Commission</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {commissions.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3">{c.partner.name}</td>
                    <td className="px-4 py-3">{c.application.trackingId}</td>
                    <td className="px-4 py-3">{formatMoney(c.saleAmountUsdMinor, "USD")}</td>
                    <td className="px-4 py-3">{c.commissionPercent}%</td>
                    <td className="px-4 py-3 font-medium">{formatMoney(c.commissionAmountUsdMinor, "USD")}</td>
                    <td className="px-4 py-3"><Badge value={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
