import {
  APPLICATION_STATUS_LABELS,
  progressPercent,
  type ApplicationStatus,
} from "@/lib/statuses";

export default function StatusProgress({ status }: { status: string }) {
  const label = APPLICATION_STATUS_LABELS[status as ApplicationStatus] ?? status;
  const cancelled = status === "CANCELLED";
  const percent = cancelled ? 0 : progressPercent(status);

  return (
    <div>
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            cancelled
              ? "bg-red-50 text-red-700"
              : status === "COMPLETED"
                ? "bg-emerald/10 text-emerald-dark"
                : "bg-gold/20 text-gold-dark"
          }`}
        >
          {label}
        </span>
        {!cancelled && <span className="text-xs text-ink/50">{percent}%</span>}
      </div>
      {!cancelled && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-emerald transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </div>
  );
}
