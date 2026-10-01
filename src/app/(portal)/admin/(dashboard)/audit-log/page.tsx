import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogPage() {
  const entries = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-emerald-dark">Audit log</h1>
      <p className="mt-1 text-sm text-ink/60">
        Who changed what, and when. Written automatically for prices, exchange rates, statuses, payments and sign-ins.
      </p>

      {entries.length === 0 ? (
        <p className="mt-6 rounded-xl border border-black/5 bg-white p-6 text-sm text-ink/55">
          No entries yet. Actions taken from now on are recorded here.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-ivory text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {entries.map((e) => (
                <tr key={e.id}>
                  <td className="whitespace-nowrap px-4 py-3 text-ink/60">{e.createdAt.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-emerald-dark">{e.actorType}</span>
                    {e.actorEmail && <span className="block text-xs text-ink/50">{e.actorEmail}</span>}
                  </td>
                  <td className="px-4 py-3 font-medium">{e.action}</td>
                  <td className="px-4 py-3 text-ink/70">
                    {e.entity}
                    {e.entityId && <span className="block font-mono text-[11px] text-ink/40">{e.entityId}</span>}
                  </td>
                  <td className="max-w-md px-4 py-3">
                    <code className="block truncate text-[11px] text-ink/55">
                      {e.metadata ? JSON.stringify(e.metadata) : "—"}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
