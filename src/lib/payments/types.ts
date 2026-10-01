export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface InitializeParams {
  reference: string;
  amountMinor: number;
  currency: string;
  email: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export interface InitializeResult {
  checkoutUrl: string;
  providerReference: string;
}

export interface VerifiedPayment {
  providerReference: string;
  status: PaymentStatus;
  amountMinor: number;
  currency: string;
  method?: string | null;
  paidAt?: Date | null;
  failureReason?: string | null;
  raw?: unknown;
}

/**
 * Every provider implements this interface. Application code (invoices,
 * statuses, commissions) never imports a provider directly, so adding
 * Flutterwave later means adding one file, not rewriting the payment flow.
 */
/** Refund details carried by a provider's refund webhook, in minor units. */
export interface ParsedRefund {
  amountMinor: number;
  currency: string | null;
  /** CONFIRMED refunds change the sale; PENDING/FAILED never do. */
  confirmed: boolean;
}

export type ParsedWebhook =
  | { ok: true; eventId: string; type: string; reference: string | null; refund?: ParsedRefund }
  | { ok: false; error: string };

export interface PaymentProvider {
  readonly name: string;
  readonly supportedCurrencies: string[];
  isConfigured(): boolean;
  initialize(params: InitializeParams): Promise<InitializeResult>;
  /** Server-side verification — the browser's word is never trusted. */
  verify(providerReference: string): Promise<VerifiedPayment>;
  /** Verifies the webhook signature and returns the parsed event. */
  parseWebhook(rawBody: string, headers: Headers): ParsedWebhook;
}
