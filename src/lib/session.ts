import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export function makeSession<T extends Record<string, string>>(cookieName: string) {
  async function createSession(payload: T) {
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
      .sign(getSecretKey());

    const cookieStore = await cookies();
    cookieStore.set(cookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
    });
  }

  async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete(cookieName);
  }

  async function getSession(): Promise<T | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName)?.value;
    return verifyToken(token);
  }

  async function verifyToken(token: string | undefined): Promise<T | null> {
    if (!token) return null;
    try {
      const { payload } = await jwtVerify(token, getSecretKey());
      return payload as unknown as T;
    } catch {
      return null;
    }
  }

  return { createSession, clearSession, getSession, verifyToken, cookieName };
}
