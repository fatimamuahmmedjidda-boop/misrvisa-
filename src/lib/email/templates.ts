import { SITE_URL, WHATSAPP_NUMBER } from "@/lib/content/social";
import { formatMoney } from "@/lib/money";
import type { EmailMessage } from "@/lib/email";

const site = process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL;
const footer = `\n\nMISR VISA — Cairo, Egypt\n${site}\nWhatsApp: ${WHATSAPP_NUMBER}\n\nMISR VISA is a private travel assistance company and is not affiliated with the Government of Egypt, any embassy or any airline.`;

export function passwordResetEmail(params: { to: string; resetUrl: string; minutes: number }): EmailMessage {
  return {
    to: params.to,
    subject: "Reset your MISR VISA password",
    text:
      `We received a request to reset your MISR VISA password.\n\n` +
      `Open this link to choose a new password:\n${params.resetUrl}\n\n` +
      `The link works once and expires in ${params.minutes} minutes. ` +
      `If you did not request this, you can ignore this email — nothing will change.${footer}`,
  };
}

export function applicationReceivedEmail(params: {
  to: string;
  fullName: string;
  trackingId: string;
  serviceName: string;
}): EmailMessage {
  return {
    to: params.to,
    subject: `We received your application — ${params.trackingId}`,
    text:
      `Hello ${params.fullName},\n\n` +
      `We have received your ${params.serviceName} application.\n\n` +
      `Your tracking number: ${params.trackingId}\n` +
      `Follow your status any time: ${site}/track\n\n` +
      `Our Cairo team will contact you on WhatsApp with today's price and the next step.${footer}`,
  };
}

export function paymentReceivedEmail(params: {
  to: string;
  fullName: string;
  trackingId: string;
  invoiceNumber: string;
  amountMinor: number;
  currency: string;
  minorUnits?: number;
}): EmailMessage {
  return {
    to: params.to,
    subject: `Payment received — ${params.trackingId}`,
    text:
      `Hello ${params.fullName},\n\n` +
      `We have received your payment of ${formatMoney(params.amountMinor, params.currency, params.minorUnits ?? 2)} ` +
      `for invoice ${params.invoiceNumber}.\n\n` +
      `Application: ${params.trackingId}\n` +
      `Status: Payment received — processing has started.\n\n` +
      `Track your application: ${site}/track${footer}`,
  };
}
