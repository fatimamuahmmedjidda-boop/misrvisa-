// Application lifecycle. Legacy values (RECEIVED, UNDER_REVIEW, PROCESSING,
// READY, COMPLETED, CANCELLED, DOCUMENTS_REQUIRED) are still valid so existing
// rows and the existing admin UI keep working; new states extend them.

export const APPLICATION_STATUSES = [
  "DRAFT",
  "RECEIVED",
  "APPLICATION_RECEIVED",
  "UNDER_REVIEW",
  "DOCUMENTS_REQUIRED",
  "PAYMENT_PENDING",
  "PAID",
  "PROCESSING",
  "SUBMITTED",
  "OKTB_PROCESSING",
  "OKTB_APPROVED",
  "READY",
  "READY_TO_TRAVEL",
  "COMPLETED",
  "CANCELLED",
  "REFUSED",
  "EXPIRED",
  "REFUNDED",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: "Draft",
  RECEIVED: "Application Received",
  APPLICATION_RECEIVED: "Application Received",
  UNDER_REVIEW: "Under Review",
  DOCUMENTS_REQUIRED: "Documents Required",
  PAYMENT_PENDING: "Payment Pending",
  PAID: "Payment Received",
  PROCESSING: "Processing",
  SUBMITTED: "Submitted",
  OKTB_PROCESSING: "OK-to-Board Processing",
  OKTB_APPROVED: "OK-to-Board Approved",
  READY: "Ready",
  READY_TO_TRAVEL: "Ready to Travel",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REFUSED: "Refused",
  EXPIRED: "Expired",
  REFUNDED: "Refunded",
};

/** Legacy value → current canonical value (for display and progress bars). */
const CANONICAL: Partial<Record<ApplicationStatus, ApplicationStatus>> = {
  RECEIVED: "APPLICATION_RECEIVED",
  READY: "READY_TO_TRAVEL",
};

export function canonicalStatus(status: string): ApplicationStatus {
  const s = status as ApplicationStatus;
  return CANONICAL[s] ?? s;
}

/** Ordered customer-facing journey; terminal states are handled separately. */
export const STATUS_JOURNEY: ApplicationStatus[] = [
  "APPLICATION_RECEIVED",
  "UNDER_REVIEW",
  "PAYMENT_PENDING",
  "PAID",
  "PROCESSING",
  "OKTB_PROCESSING",
  "OKTB_APPROVED",
  "READY_TO_TRAVEL",
  "COMPLETED",
];

export const TERMINAL_STATUSES: ApplicationStatus[] = ["COMPLETED", "CANCELLED", "REFUSED", "EXPIRED", "REFUNDED"];

export function isTerminal(status: string) {
  return TERMINAL_STATUSES.includes(canonicalStatus(status));
}

export function journeyIndex(status: string) {
  return STATUS_JOURNEY.indexOf(canonicalStatus(status));
}

// Ordered stages shown as a progress bar to customers. End states (cancelled,
// refused, expired) are excluded — they are not steps along the way.
export const APPLICATION_PROGRESS_STAGES = [
  "APPLICATION_RECEIVED",
  "UNDER_REVIEW",
  "PAYMENT_PENDING",
  "PAID",
  "PROCESSING",
  "OKTB_APPROVED",
  "READY_TO_TRAVEL",
  "COMPLETED",
] as const;

export function progressPercent(status: string): number {
  const index = APPLICATION_PROGRESS_STAGES.indexOf(
    canonicalStatus(status) as (typeof APPLICATION_PROGRESS_STAGES)[number],
  );
  if (index < 0) return 0;
  return Math.round((index / (APPLICATION_PROGRESS_STAGES.length - 1)) * 100);
}

export const PARTNER_STATUSES = ["NEW", "CONTACTED", "IN_DISCUSSION", "ACTIVE", "DECLINED"] as const;

export type PartnerStatus = (typeof PARTNER_STATUSES)[number];

export const PARTNER_STATUS_LABELS: Record<PartnerStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  IN_DISCUSSION: "In Discussion",
  ACTIVE: "Active",
  DECLINED: "Declined",
};

export const SERVICE_LEVELS = ["STANDARD", "VIP"] as const;
export type ServiceLevel = (typeof SERVICE_LEVELS)[number];

export const SERVICE_LEVEL_LABELS: Record<ServiceLevel, string> = {
  STANDARD: "Standard (within 24 hours)",
  VIP: "VIP same day (within 12 hours)",
};
