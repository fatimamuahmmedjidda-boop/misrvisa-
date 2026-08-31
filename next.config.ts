import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /about told the same founding story as /who-we-are. Two pages competing
      // for the same query splits ranking signals, so /about permanently points
      // at the canonical page and keeps any existing inbound links working.
      { source: "/about", destination: "/who-we-are", permanent: true },
    ];
  },
};

export default nextConfig;
