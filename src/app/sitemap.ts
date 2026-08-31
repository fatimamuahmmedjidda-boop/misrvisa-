import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { services } from "@/lib/content/services";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const priorities: Record<string, number> = {
    "": 1,
    "/visa-on-arrival": 0.9,
    "/services": 0.8,
    "/apply": 0.8,
    "/how-it-works": 0.7,
    "/faq": 0.7,
    "/who-we-are": 0.7,
    "/contact": 0.6,
    "/track": 0.6,
    "/blog": 0.6,
    "/partner": 0.5,
    "/terms": 0.3,
  };

  const staticRoutes = Object.keys(priorities).map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: (path === "" || path === "/blog" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority: priorities[path],
  }));

  const serviceRoutes = services
    .filter((s) => s.slug !== "visa-on-arrival")
    .map((s) => ({
      url: `${siteUrl}/services/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });
  const postRoutes = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
