import { createHmac, timingSafeEqual } from "crypto";
import type { InitializeParams, InitializeResult, ParsedWebhook, PaymentProvider, PaymentStatus, VerifiedPayment } from "./types";

const API = "https://api.paystack.co";

/** Currencies Paystack can charge. The business must confirm which are enabled on its own account. */
const SUPPORTED = ["NGN", "GHS", "ZAR", "KES", "USD"];

function secret() {
  return process.env.PAYSTACK_SECRET_KEY ?? "";
}

function mapStatus(status: string): PaymentStatus {
  switch (status) {
    case "success":
      return "SUCCESS";
    case "failed":
      return "FAILED";
    case "abandoned":
      return "CANCELLED";
    case "reversed":
      return "REFUNDED";
    case "ongoing":
    case "pending":
      return "PROCESSING";
    default:
      return "PENDING";
  }
}

export class PaystackProvider implements PaymentProvider {
  readonly name = "PAYSTACK";
  readonly supportedCurrencies = SUPPORTED;

  isConfigured() {
    return secret().length > 0;
  }

  private async call(path: string, init?: RequestInit) {
    const res = await fetch(`${API}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${secret()}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
    const data = (await res.json().catch(() => ({}))) as { status?: boolean; message?: string; data?: unknown };
    if (!res.ok || data.status === false) {
      throw new Error(data.message ?? `Paystack request failed (${res.status})`);
    }
    return data.data as Record<string, unknown>;
  }

  async initialize(params: InitializeParams): Promise<InitializeResult> {
    const data = await this.call("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        reference: params.reference,
        amount: params.amountMinor,
        currency: params.currency,
        email: params.email,
        callback_url: params.callbackUrl,
        metadata: params.metadata ?? {},
      }),
    });
    return {
      checkoutUrl: String(data.authorization_url),
      providerReference: String(data.reference ?? params.reference),
    };
  }

  async verify(providerReference: string): Promise<VerifiedPayment> {
    const data = await this.call(`/transaction/verify/${encodeURIComponent(providerReference)}`);
    const status = mapStatus(String(data.status ?? ""));
    return {
      providerReference: String(data.reference ?? providerReference),
      status,
      amountMinor: Number(data.amount ?? 0),
      currency: String(data.currency ?? ""),
      method: (data.channel as string | undefined) ?? null,
      paidAt: data.paid_at ? new Date(String(data.paid_at)) : null,
      failureReason: status === "FAILED" ? ((data.gateway_response as string | undefined) ?? null) : null,
      raw: data,
    };
  }

  parseWebhook(rawBody: string, headers: Headers): ParsedWebhook {
    const signature = headers.get("x-paystack-signature");
    if (!signature) return { ok: false as const, error: "Missing signature header." };
    if (!this.isConfigured()) return { ok: false as const, error: "Paystack is not configured." };

    const expected = createHmac("sha512", secret()).update(rawBody).digest("hex");
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false as const, error: "Invalid signature." };
    }

    let parsed: {
      event?: string;
      id?: string | number;
      data?: {
        id?: string | number;
        reference?: string;
        status?: string;
        amount?: number;
        currency?: string;
        // Refund events reference the original transaction, not themselves.
        transaction_reference?: string;
        transaction?: { reference?: string };
      };
    };
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      return { ok: false as const, error: "Invalid JSON body." };
    }

    const event = String(parsed.event ?? "unknown");
    const reference =
      parsed.data?.transaction_reference ?? parsed.data?.transaction?.reference ?? parsed.data?.reference ?? null;

    // Paystack sends refund.pending, refund.processed and refund.failed. Only a
    // processed refund is treated as confirmed money returned.
    const refund = event.startsWith("refund.")
      ? {
          amountMinor: Number(parsed.data?.amount ?? 0),
          currency: parsed.data?.currency ? String(parsed.data.currency) : null,
          confirmed: event === "refund.processed" && (parsed.data?.status ?? "processed") !== "failed",
        }
      : undefined;
    // Paystack does not always send a top-level event id; the transaction id
    // plus the event type is unique enough to make processing idempotent.
    const eventId = String(parsed.id ?? `${event}:${parsed.data?.id ?? reference ?? ""}`);
    return { ok: true as const, eventId, type: event, reference, refund };
  }
}
