import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// Third-party tag hosts are only allowed once their IDs are configured.
const tagHosts = [
  process.env.NEXT_PUBLIC_GA_ID && "https://www.googletagmanager.com https://*.google-analytics.com",
  process.env.NEXT_PUBLIC_META_PIXEL_ID && "https://connect.facebook.net https://www.facebook.com",
  process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID && "https://analytics.tiktok.com https://*.tiktok.com",
]
  .filter(Boolean)
  .join(" ");

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://vercel.live https://va.vercel-scripts.com ${tagHosts}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://vercel.live wss://ws-us3.pusher.com ${tagHosts}`,
  "frame-src https://vercel.live",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/(admin|account|partner-portal)/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
    ];
  },
  async redirects() {
    return [
      // /about told the same founding story as /who-we-are. Two pages competing
      // for the same query splits ranking signals, so /about permanently points
      // at the canonical page and keeps any existing inbound links working.
      { source: "/about", destination: "/who-we-are", permanent: true },
      { source: "/egypt-visa", destination: "/visa-on-arrival", permanent: true },
      { source: "/egypt-visa-on-arrival", destination: "/visa-on-arrival", permanent: true },
      { source: "/ok-to-board", destination: "/services/ok-to-board", permanent: true },
      { source: "/partners", destination: "/partner", permanent: true },
    ];
  },
};

export default nextConfig;
