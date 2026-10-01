import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const privatePaths = ["/admin", "/api/", "/account", "/partner-portal"];

// Search engines and AI assistants (ChatGPT, Claude, Gemini, Perplexity, Copilot,
// Apple) are explicitly welcome, so MISR VISA can be cited in AI answers.
const aiAndSearchBots = [
  "Googlebot",
  "Bingbot",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "DuckDuckBot",
  "YandexBot",
  "meta-externalagent",
  "facebookexternalhit",
  "LinkedInBot",
  "Twitterbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...aiAndSearchBots.map((userAgent) => ({ userAgent, allow: "/", disallow: privatePaths })),
      { userAgent: "*", allow: "/", disallow: privatePaths },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
