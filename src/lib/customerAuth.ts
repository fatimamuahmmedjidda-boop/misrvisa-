import { makeSession } from "./session";

export const CUSTOMER_SESSION_COOKIE = "misrvisa_customer_session";

export interface CustomerSessionPayload extends Record<string, string> {
  customerId: string;
  email: string;
  fullName: string;
  /** Session version — bumped on password change so old tokens stop working. */
  v: string;
}

const customerSession = makeSession<CustomerSessionPayload>(CUSTOMER_SESSION_COOKIE);

export const createCustomerSession = customerSession.createSession;
export const clearCustomerSession = customerSession.clearSession;
export const getCustomerSession = customerSession.getSession;
export const verifyCustomerSessionFromToken = customerSession.verifyToken;
