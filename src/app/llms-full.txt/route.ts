import { ARTICLES } from "@/lib/content/articles";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const body = ARTICLES.map(
    (a) => `# ${a.title}\nURL: ${siteUrl}/blog/${a.slug}\nPublished: ${a.publishedAt} · Category: ${a.category}\n\n${a.body.replace(/\]\(\//g, `](${siteUrl}/`)}`,
  ).join("\n\n---\n\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
