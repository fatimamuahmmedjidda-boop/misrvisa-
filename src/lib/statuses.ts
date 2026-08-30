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
