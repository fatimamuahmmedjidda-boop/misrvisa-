import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { services } from "@/lib/content/services";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/visa-on-arrival",
    "/how-it-works",
    "/faq",
    "/blog",
    "/contact",
    "/apply",
    "/track",
    "/partner",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const serviceRoutes = services
    .filter((s) => s.slug !== "visa-on-arrival")
    .map((s) => ({
      url: `${siteUrl}/services/${s.slug}`,
      lastModified: new Date(),
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
