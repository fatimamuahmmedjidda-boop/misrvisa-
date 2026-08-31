import { makeSession } from "./session";

export const PARTNER_SESSION_COOKIE = "misrvisa_partner_session";

export interface PartnerSessionPayload extends Record<string, string> {
  partnerId: string;
  email: string;
  name: string;
}

const partnerSession = makeSession<PartnerSessionPayload>(PARTNER_SESSION_COOKIE);

export const createPartnerSession = partnerSession.createSession;
export const clearPartnerSession = partnerSession.clearSession;
export const getPartnerSession = partnerSession.getSession;
export const verifyPartnerSessionFromToken = partnerSession.verifyToken;
