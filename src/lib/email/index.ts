/**
 * Transactional email behind a provider interface. Business code calls
 * `sendEmail(...)` and never knows which provider delivered the message, so
 * Resend can be swapped for Postmark/SES without touching business logic.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<{ ok: true; id?: string } | { ok: false; error: string }>;
}

class ResendProvider implements EmailProvider {
  readonly name = "resend";
  constructor(private apiKey: string, private from: string) {}

  async send(message: EmailMessage) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: this.from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html,
        reply_to: message.replyTo,
      }),
    });
    if (!res.ok) {
      // Resend's error body carries the reason (e.g. an unverified sender
      // domain). It contains no secret, and knowing it turns a silent failure
      // into something fixable.
      const detail = (await res.json().catch(() => null)) as { name?: string; message?: string } | null;
      return {
        ok: false as const,
        error: `Resend responded ${res.status}${detail?.message ? `: ${detail.message}` : ""}`,
      };
    }
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true as const, id: data.id };
  }
}

/** Used until an email provider is configured: logs instead of sending. */
class ConsoleProvider implements EmailProvider {
  readonly name = "console";
  async send(message: EmailMessage) {
    console.warn("[email] no provider configured — message not sent", {
      to: message.to,
      subject: message.subject,
    });
    return { ok: false as const, error: "No email provider configured." };
  }
}

export function getEmailProvider(): EmailProvider {
  // Trimmed, so a value that is accidentally blank or whitespace-only is
  // treated as missing rather than silently selecting a broken provider.
  const from = process.env.EMAIL_FROM?.trim();
  const key = process.env.RESEND_API_KEY?.trim();
  const provider = (process.env.EMAIL_PROVIDER?.trim() || (key ? "resend" : "console")).toLowerCase();
  if (provider === "resend" && key && from) return new ResendProvider(key, from);
  return new ConsoleProvider();
}

/**
 * TEMPORARY DIAGNOSTIC — remove once email delivery is confirmed.
 *
 * Logged at error level so it cannot be hidden by a log viewer that filters
 * warnings. It reports presence, declared-ness and length only — never a value,
 * so "variable absent" can be told apart from "variable present but empty".
 */
function logEmailConfigDiagnostic(providerName: string) {
  const from = process.env.EMAIL_FROM;
  const key = process.env.RESEND_API_KEY;
  console.error("[email-config]", {
    selectedProvider: providerName,
    emailFromDeclared: "EMAIL_FROM" in process.env,
    emailFromLength: from?.trim().length ?? 0,
    emailFromHasAt: Boolean(from?.includes("@")),
    resendKeyDeclared: "RESEND_API_KEY" in process.env,
    resendKeyLength: key?.trim().length ?? 0,
    resendKeyPrefixOk: Boolean(key?.trim().startsWith("re_")),
    emailProviderOverride: process.env.EMAIL_PROVIDER?.trim() ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
    vercelEnv: process.env.VERCEL_ENV ?? null,
  });
}

export async function sendEmail(message: EmailMessage) {
  const provider = getEmailProvider();
  logEmailConfigDiagnostic(provider.name);
  try {
    const result = await provider.send(message);
    if (!result.ok) console.error("[email] send failed", { provider: provider.name, error: result.error });
    return result;
  } catch (err) {
    console.error("[email] send threw", err);
    return { ok: false as const, error: "Email provider error." };
  }
}

export function isEmailConfigured() {
  return getEmailProvider().name !== "console";
}
