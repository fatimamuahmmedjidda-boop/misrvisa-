import { makeSession } from "./session";

const SESSION_COOKIE = "misrvisa_admin_session";

export interface AdminSessionPayload extends Record<string, string> {
  adminId: string;
  email: string;
  name: string;
}

const adminSession = makeSession<AdminSessionPayload>(SESSION_COOKIE);

export const createAdminSession = adminSession.createSession;
export const clearAdminSession = adminSession.clearSession;
export const getAdminSession = adminSession.getSession;
export const verifyAdminSessionFromToken = adminSession.verifyToken;

export { SESSION_COOKIE };
