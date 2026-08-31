import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE = "misrvisa_admin_session";
const CUSTOMER_COOKIE = "misrvisa_customer_session";
const PARTNER_COOKIE = "misrvisa_partner_session";

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function hasValidSession(request: NextRequest, cookieName: string): Promise<boolean> {
  const token = request.cookies.get(cookieName)?.value;
  const key = getSecretKey();
  if (!token || !key) return false;
  try {
    await jwtVerify(token, key);
    return true;
  } catch {
    return false;
  }
}

const areas = [
  {
    cookie: ADMIN_COOKIE,
    loginPath: "/admin/login",
    pagePrefix: "/admin",
    apiPrefix: "/api/admin",
    publicPaths: ["/admin/login", "/api/admin/login"],
  },
  {
    cookie: PARTNER_COOKIE,
    loginPath: "/partner-portal/login",
    pagePrefix: "/partner-portal",
    apiPrefix: "/api/partner-portal",
    publicPaths: ["/partner-portal/login", "/api/partner-portal/login"],
  },
  {
    cookie: CUSTOMER_COOKIE,
    loginPath: "/account/login",
    pagePrefix: "/account",
    apiPrefix: "/api/account",
    publicPaths: [
      "/account/login",
      "/account/register",
      "/api/account/login",
      "/api/account/register",
    ],
  },
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const area = areas.find(
    (a) => pathname.startsWith(a.pagePrefix) || pathname.startsWith(a.apiPrefix)
  );

  if (!area || area.publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (await hasValidSession(request, area.cookie)) {
    return NextResponse.next();
  }

  if (pathname.startsWith(area.apiPrefix)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL(area.loginPath, request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/partner-portal/:path*",
    "/api/partner-portal/:path*",
    "/account/:path*",
    "/api/account/:path*",
  ],
};
