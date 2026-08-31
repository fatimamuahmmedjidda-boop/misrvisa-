import { randomBytes } from "crypto";

export const RESET_TOKEN_TTL_MINUTES = 60;

export function createResetToken() {
  return randomBytes(32).toString("base64url");
}

export function resetExpiry() {
  return new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);
}
