import { ArticleCard, CtaBand } from "@/components/site/sections";
import { FadeIn } from "@/components/site/motion";
import { Container, PageHero } from "@/components/site/ui";
import { ARTICLES, type Article } from "@/lib/content/articles";
import { prisma } from "@/lib/prisma";
import { JsonLdScript, breadcrumbJsonLd, pageMetadata, siteUrl } from "@/lib/seo";

export const revalidate = 600;

export const metadata = pageMetadata({
  title: "Egypt Stories: Visa News, Egyptian History, Culture & Investment",
  description:
    "The MISR VISA journal: Egypt visa on arrival updates, OK-to-Board guides, the history of ancient Egypt, the Grand Egyptian Museum, Egypt tourism news and investment opportunities.",
  path: "/blog",
  keywords: ["Egypt blog", "Egypt history", "Egypt news", "Egypt travel tips", "invest in Egypt"],
});

type Card = Pick<Article, "slug" | "title" | "description" | "category" | "motif" | "readMinutes">;

async function getDbPosts(): Promise<Card[]> {
  try {
    const posts = await prisma.blogPost.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
    return posts
      .filter((p) => !ARTICLES.some((a) => a.slug === p.slug))
      .map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.excerpt,
        category: (p.category as Article["category"]) ?? "Egypt News",
        motif: "passport",
        readMinutes: Math.max(2, Math.round(p.content.replace(/<[^>]+>/g, " ").split(/\s+/).length / 220)),
      }));
  } catch {
    return [];
  }
}

export default async function BlogIndexPage() {
  const all: Card[] = [...(await getDbPosts()), ...ARTICLES];
  const [featured, ...rest] = all;
  const categories = Array.from(new Set(rest.map((a) => a.category)));

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "MISR VISA — Egypt Stories",
    url: `${siteUrl}/blog`,
    publisher: { "@id": `${siteUrl}/#organization` },
    blogPost: all.map((a) => ({ "@type": "BlogPosting", headline: a.title, url: `${siteUrl}/blog/${a.slug}` })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript([blogJsonLd, breadcrumbJsonLd([{ name: "Egypt Stories", path: "/blog" }])])} />
      <PageHero
        eyebrow="The MISR VISA journal"
        title={<>Egypt <span className="text-gold-gradient italic">stories</span>.</>}
        lead="Visa updates that matter, 5,000 years of history, and the new Egypt of museums, record tourism and investment."
      >
        {categories.map((c) => (
          <a key={c} href={`#${c.toLowerCase().replace(/\W+/g, "-")}`} className="rounded-full border border-ivory/15 px-4 py-2 text-sm text-ivory/70 hover:border-gold/60 hover:text-gold">
            {c}
          </a>
        ))}
      </PageHero>

      <section className="pb-10">
        <Container>
          {featured && (
            <FadeIn className="mx-auto max-w-4xl">
              <ArticleCard article={featured} large />
            </FadeIn>
          )}
        </Container>
      </section>

      {categories.map((c) => (
        <section key={c} id={c.toLowerCase().replace(/\W+/g, "-")} className="scroll-mt-28 py-12">
          <Container>
            <h2 className="text-3xl text-ivory">{c}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest
                .filter((a) => a.category === c)
                .map((a, i) => (
                  <FadeIn key={a.slug} delay={0.05 * i}>
                    <ArticleCard article={a} />
                  </FadeIn>
                ))}
            </div>
          </Container>
        </section>
      ))}
      <CtaBand />
    </>
  );
}
