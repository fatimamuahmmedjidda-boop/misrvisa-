export const APPLICATION_STATUSES = [
  "RECEIVED",
  "UNDER_REVIEW",
  "DOCUMENTS_REQUIRED",
  "PROCESSING",
  "READY",
  "COMPLETED",
  "CANCELLED",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  RECEIVED: "Application Received",
  UNDER_REVIEW: "Under Review",
  DOCUMENTS_REQUIRED: "Documents Required",
  PROCESSING: "Processing",
  READY: "Ready",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// Ordered stages shown as a progress bar to customers. CANCELLED is excluded —
// it is an end state, not a step along the way.
export const APPLICATION_PROGRESS_STAGES = [
  "RECEIVED",
  "UNDER_REVIEW",
  "DOCUMENTS_REQUIRED",
  "PROCESSING",
  "READY",
  "COMPLETED",
] as const;

export function progressPercent(status: string): number {
  const index = APPLICATION_PROGRESS_STAGES.indexOf(
    status as (typeof APPLICATION_PROGRESS_STAGES)[number]
  );
  if (index < 0) return 0;
  return Math.round((index / (APPLICATION_PROGRESS_STAGES.length - 1)) * 100);
}

export const PARTNER_STATUSES = [
  "NEW",
  "CONTACTED",
  "IN_DISCUSSION",
  "ACTIVE",
  "DECLINED",
] as const;

export type PartnerStatus = (typeof PARTNER_STATUSES)[number];

export const PARTNER_STATUS_LABELS: Record<PartnerStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  IN_DISCUSSION: "In Discussion",
  ACTIVE: "Active",
  DECLINED: "Declined",
};
