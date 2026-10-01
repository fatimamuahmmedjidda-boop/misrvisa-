import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { logAudit, type ActorType } from "@/lib/audit";
import { changeApplicationStatus } from "@/lib/applicationStatus";
import { sendEmail } from "@/lib/email";
import { paymentReceivedEmail } from "@/lib/email/templates";
import { getConfiguredProvider, getPaymentProvider } from "./index";
import type { VerifiedPayment } from "./types";

/**
 * Payment business logic. Nothing here is provider-specific: a provider only
 * initializes a checkout, verifies a reference and validates a webhook.
 *
 * An application is never marked PAID because the browser said so — it is
 * marked PAID only after the provider is queried server-side.
 */

function newReference(invoiceNumber: string) {
  return `${invoiceNumber}-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function startPayment(params: {
  invoiceId: string;
  customerId: string;
  callbackUrl: string;
  request?: Request;
}) {
  const provider = getConfiguredProvider();
  if (!provider) return { error: "Online payment is not configured yet." as const };

  const invoice = await prisma.invoice.findFirst({
    where: { id: params.invoiceId, customerId: params.customerId },
    include: { customer: { select: { email: true, fullName: true } }, application: { select: { id: true, trackingId: true, partnerId: true } } },
  });
  if (!invoice) return { error: "Invoice not found." as const };
  if (invoice.status === "PAID") return { error: "This invoice is already paid." as const };
  if (invoice.status === "CANCELLED") return { error: "This invoice was cancelled." as const };

  if (!provider.supportedCurrencies.includes(invoice.chargeCurrency)) {
    return {
      error: `${provider.name} is not configured to charge ${invoice.chargeCurrency} on this account.` as const,
    };
  }

  const reference = newReference(invoice.number);

  // The pending record exists before the customer reaches the checkout page, so
  // a webhook that arrives first still finds something to update.
  const payment = await prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      applicationId: invoice.applicationId,
      customerId: invoice.customerId,
      partnerId: invoice.partnerId,
      provider: provider.name,
      providerReference: reference,
      amountMinor: invoice.totalChargeMinor,
      currency: invoice.chargeCurrency,
      baseAmountUsdMinor: invoice.totalUsdMinor,
      exchangeRate: invoice.exchangeRate,
      status: "PENDING",
    },
  });

  try {
    const result = await provider.initialize({
      reference,
      amountMinor: invoice.totalChargeMinor,
      currency: invoice.chargeCurrency,
      email: invoice.customer.email,
      callbackUrl: params.callbackUrl,
      metadata: { invoiceNumber: invoice.number, trackingId: invoice.application.trackingId },
    });

    await prisma.payment.update({ where: { id: payment.id }, data: { status: "PROCESSING" } });
    await logAudit({
      actor: { type: "CUSTOMER", id: invoice.customerId },
      action: "PAYMENT_INITIALIZED",
      entity: "Payment",
      entityId: payment.id,
      metadata: { invoice: invoice.number, provider: provider.name, currency: invoice.chargeCurrency },
      request: params.request,
    });

    return { checkoutUrl: result.checkoutUrl, reference };
  } catch (err) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED", failedAt: new Date(), failureReason: "Could not start checkout." },
    });
    console.error("Payment initialization failed", err);
    return { error: "We could not start the payment. Please try again." as const };
  }
}

/**
 * Verifies a reference with the provider and applies the result exactly once.
 * Safe to call from the webhook, the return URL, and an admin retry.
 */
export async function settlePayment(params: {
  reference: string;
  actor: { type: ActorType; id?: string | null; email?: string | null };
  request?: Request;
}) {
  const payment = await prisma.payment.findUnique({
    where: { providerReference: params.reference },
    include: {
      invoice: { select: { id: true, number: true, status: true, subtotalUsdMinor: true, partnerId: true } },
      customer: { select: { email: true, fullName: true } },
      application: { select: { id: true, trackingId: true, status: true } },
    },
  });
  if (!payment) return { error: "Unknown payment reference." as const };

  const provider = getPaymentProvider(payment.provider);
  if (!provider || !provider.isConfigured()) return { error: "Payment provider unavailable." as const };

  let verified: VerifiedPayment;
  try {
    verified = await provider.verify(params.reference);
  } catch (err) {
    console.error("Payment verification failed", err);
    return { error: "Could not verify this payment with the provider." as const };
  }

  // Already settled — do nothing (duplicate webhook delivery).
  if (payment.status === "SUCCESS" && verified.status === "SUCCESS") {
    return { payment, alreadySettled: true as const };
  }

  if (verified.status !== "SUCCESS") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: verified.status,
        failedAt: verified.status === "FAILED" ? new Date() : null,
        failureReason: verified.failureReason ?? null,
        method: verified.method ?? null,
      },
    });
    await logAudit({
      actor: params.actor,
      action: "PAYMENT_NOT_SUCCESSFUL",
      entity: "Payment",
      entityId: payment.id,
      metadata: { status: verified.status, reference: params.reference },
      request: params.request,
    });
    return { payment, settled: false as const, status: verified.status };
  }

  // Amount/currency must match what we asked for, or a manipulated checkout
  // could pay less than the invoice.
  if (verified.amountMinor !== payment.amountMinor || verified.currency !== payment.currency) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED", failedAt: new Date(), failureReason: "Amount or currency mismatch." },
    });
    await logAudit({
      actor: params.actor,
      action: "PAYMENT_MISMATCH",
      entity: "Payment",
      entityId: payment.id,
      metadata: {
        expected: { amountMinor: payment.amountMinor, currency: payment.currency },
        received: { amountMinor: verified.amountMinor, currency: verified.currency },
      },
      request: params.request,
    });
    return { error: "Payment amount did not match the invoice." as const };
  }

  const paidAt = verified.paidAt ?? new Date();

  // Only the delivery that actually flips PENDING/PROCESSING → SUCCESS performs
  // the business effects and sends the email. A simultaneous second delivery
  // updates 0 rows and stops here.
  const claimed = await prisma.payment.updateMany({
    where: { id: payment.id, status: { not: "SUCCESS" } },
    data: { status: "SUCCESS", paidAt, method: verified.method ?? null },
  });
  if (claimed.count === 0) {
    return { payment, alreadySettled: true as const };
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { metadata: { channel: verified.method ?? null } },
    });
    await tx.invoice.update({ where: { id: payment.invoiceId }, data: { status: "PAID", paidAt } });

    // Commission becomes eligible only once money has actually been received,
    // and freezes the rate that applied at that moment.
    if (payment.invoice.partnerId) {
      const partner = await tx.partner.findUnique({
        where: { id: payment.invoice.partnerId },
        select: { commissionPercent: true },
      });
      if (partner) {
        const saleAmountUsdMinor = payment.invoice.subtotalUsdMinor;
        const commissionAmountUsdMinor = Math.round((saleAmountUsdMinor * partner.commissionPercent) / 100);
        await tx.commission.upsert({
          where: { invoiceId: payment.invoiceId },
          update: {},
          create: {
            partnerId: payment.invoice.partnerId,
            applicationId: payment.applicationId,
            invoiceId: payment.invoiceId,
            saleAmountUsdMinor,
            commissionPercent: partner.commissionPercent,
            commissionAmountUsdMinor,
            currency: "USD",
            status: "PENDING",
          },
        });
      }
    }
  });

  await changeApplicationStatus({
    applicationId: payment.applicationId,
    newStatus: "PAID",
    actor: { type: "SYSTEM", email: "payments" },
    note: `Payment ${payment.providerReference} confirmed with ${payment.provider}.`,
    request: params.request,
  });

  await logAudit({
    actor: params.actor,
    action: "PAYMENT_SUCCEEDED",
    entity: "Payment",
    entityId: payment.id,
    metadata: {
      reference: payment.providerReference,
      invoice: payment.invoice.number,
      amountMinor: payment.amountMinor,
      currency: payment.currency,
    },
    request: params.request,
  });

  await sendEmail(
    paymentReceivedEmail({
      to: payment.customer.email,
      fullName: payment.customer.fullName,
      trackingId: payment.application.trackingId,
      invoiceNumber: payment.invoice.number,
      amountMinor: payment.amountMinor,
      currency: payment.currency,
    }),
  );

  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;
  if (adminEmail) {
    await sendEmail({
      to: adminEmail,
      subject: `Payment received — ${payment.application.trackingId}`,
      text: `Invoice ${payment.invoice.number} was paid (${payment.currency} ${payment.amountMinor / 100}).\nApplication ${payment.application.trackingId} is now PAID.`,
    });
  }

  return { payment, settled: true as const };
}


/**
 * Decides what a refund means for the sale. Pure function (integer minor units
 * only) so it can be tested without a database.
 */
export function refundOutcome(params: {
  paymentAmountMinor: number;
  alreadyRefundedMinor: number;
  refundAmountMinor: number;
}) {
  const totalRefundedMinor = Math.min(
    params.paymentAmountMinor,
    params.alreadyRefundedMinor + params.refundAmountMinor,
  );
  const isFull = totalRefundedMinor >= params.paymentAmountMinor;
  return {
    totalRefundedMinor,
    isFull,
    paymentStatus: isFull ? ("REFUNDED" as const) : ("PARTIALLY_REFUNDED" as const),
    // A partial refund leaves the invoice paid: value was still delivered.
    invoiceStatus: isFull ? ("REFUNDED" as const) : null,
    cancelCommission: isFull,
    /** Nothing changed — a duplicate refund webhook. */
    noChange: totalRefundedMinor === params.alreadyRefundedMinor,
  };
}

/**
 * Applies a refund the provider has CONFIRMED. A refund that is still pending
 * or that failed never reaches here, so an invoice is never marked refunded on
 * an unconfirmed event.
 */
export async function processRefund(params: {
  reference: string;
  refundAmountMinor: number;
  currency?: string | null;
  actor: { type: ActorType; id?: string | null; email?: string | null };
  request?: Request;
}) {
  const payment = await prisma.payment.findUnique({
    where: { providerReference: params.reference },
    include: {
      invoice: { select: { id: true, number: true, status: true } },
      application: { select: { id: true, trackingId: true, status: true } },
    },
  });
  if (!payment) return { error: "Unknown payment reference." as const };

  if (params.currency && params.currency !== payment.currency) {
    await logAudit({
      actor: params.actor,
      action: "REFUND_CURRENCY_MISMATCH",
      entity: "Payment",
      entityId: payment.id,
      metadata: { expected: payment.currency, received: params.currency },
      request: params.request,
    });
    return { error: "Refund currency did not match the payment." as const };
  }

  const outcome = refundOutcome({
    paymentAmountMinor: payment.amountMinor,
    alreadyRefundedMinor: payment.refundedMinor,
    refundAmountMinor: params.refundAmountMinor,
  });

  // Duplicate refund delivery: the amount is already recorded.
  if (outcome.noChange) return { payment, alreadyRefunded: true as const };

  const refundedAt = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: outcome.paymentStatus,
        refundedMinor: outcome.totalRefundedMinor,
        refundedAt,
      },
    });

    if (outcome.invoiceStatus) {
      await tx.invoice.update({
        where: { id: payment.invoiceId },
        data: { status: outcome.invoiceStatus, paidAt: null },
      });
    }

    if (outcome.cancelCommission) {
      // Commission that was never paid out is cancelled; a commission already
      // paid is left alone and settled with the partner manually.
      await tx.commission.updateMany({
        where: { invoiceId: payment.invoiceId, status: { in: ["PENDING", "APPROVED"] } },
        data: { status: "CANCELLED", note: `Cancelled: payment ${payment.providerReference} refunded.` },
      });
    }
  });

  if (outcome.isFull) {
    await changeApplicationStatus({
      applicationId: payment.applicationId,
      newStatus: "REFUNDED",
      actor: { type: "SYSTEM", email: "payments" },
      note: `Full refund confirmed for payment ${payment.providerReference}.`,
      request: params.request,
    });
  }

  await logAudit({
    actor: params.actor,
    action: outcome.isFull ? "PAYMENT_REFUNDED" : "PAYMENT_PARTIALLY_REFUNDED",
    entity: "Payment",
    entityId: payment.id,
    metadata: {
      reference: payment.providerReference,
      invoice: payment.invoice.number,
      refundedMinor: outcome.totalRefundedMinor,
      paymentAmountMinor: payment.amountMinor,
      currency: payment.currency,
    },
    request: params.request,
  });

  return { payment, refunded: true as const, full: outcome.isFull, totalRefundedMinor: outcome.totalRefundedMinor };
}

/**
 * Stores the provider event first (unique per provider+eventId), so a webhook
 * delivered twice is recorded once and processed once.
 */
export async function recordWebhookEvent(params: {
  provider: string;
  eventId: string;
  type: string;
  reference: string | null;
  payload: unknown;
}) {
  try {
    const event = await prisma.paymentEvent.create({
      data: {
        provider: params.provider,
        eventId: params.eventId,
        type: params.type,
        reference: params.reference,
        payload: params.payload as object,
      },
    });
    return { event, duplicate: false as const };
  } catch {
    return { event: null, duplicate: true as const };
  }
}

export async function markWebhookProcessed(eventRowId: string, error?: string) {
  await prisma.paymentEvent.update({
    where: { id: eventRowId },
    data: { processedAt: new Date(), error: error ?? null },
  });
}
