import { createHash, randomBytes } from "crypto";

export const RESET_TOKEN_TTL_MINUTES = 60;

/**
 * Reset links carry a 32-byte random token that exists only in the email we
 * send. The database stores nothing that can be replayed:
 *
 *   tokenHash → SHA-256 of the raw token (the only value ever authenticated)
 *   token     → an opaque random placeholder, kept only because the legacy
 *               column is NOT NULL + UNIQUE. It is unrelated to the raw token
 *               and to its hash, so it can never be used to reset anything.
 */
export function createResetToken() {
  return randomBytes(32).toString("base64url");
}

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/** Unique, unusable filler for the legacy `token` column. */
export function createLegacyPlaceholder() {
  return `placeholder_${randomBytes(24).toString("hex")}`;
}

export function resetExpiry() {
  return new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);
}

/**
 * Builds exactly what gets written to the database for one reset request.
 * Extracted so it can be tested without a database.
 */
export function buildResetRecord() {
  const rawToken = createResetToken();
  return {
    rawToken,
    token: createLegacyPlaceholder(),
    tokenHash: hashResetToken(rawToken),
    expiresAt: resetExpiry(),
  };
}
