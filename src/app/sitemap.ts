import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/content/articles";
import { services } from "@/lib/content/services";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1, "weekly"],
    ["/visa-on-arrival", 0.95, "weekly"],
    ["/how-it-works", 0.8, "monthly"],
    ["/services", 0.8, "monthly"],
    ["/faq", 0.8, "weekly"],
    ["/blog", 0.8, "daily"],
    ["/partner", 0.75, "monthly"],
    ["/apply", 0.7, "monthly"],
    ["/track", 0.5, "monthly"],
    ["/who-we-are", 0.5, "yearly"],
    ["/contact", 0.5, "yearly"],
    ["/terms", 0.2, "yearly"],
    ["/privacy", 0.2, "yearly"],
  ];

  let dbPosts: { slug: string; updatedAt: Date }[] = [];
  try {
    dbPosts = await prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });
  } catch {
    // Sitemap still lists every static page if the database is unreachable.
  }

  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: `${siteUrl}${path}`, lastModified: now, changeFrequency, priority })),
    ...services
      .filter((s) => s.slug !== "visa-on-arrival")
      .map((s) => ({ url: `${siteUrl}/services/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...ARTICLES.map((a) => ({ url: `${siteUrl}/blog/${a.slug}`, lastModified: new Date(a.publishedAt), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...dbPosts
      .filter((p) => !ARTICLES.some((a) => a.slug === p.slug))
      .map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.65 })),
  ];
}
