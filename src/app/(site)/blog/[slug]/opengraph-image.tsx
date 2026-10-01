import { ImageResponse } from "next/og";
import { getArticle } from "@/lib/content/articles";

export const alt = "MISR VISA — Egypt Stories";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  const title = article?.title ?? slug.replace(/-/g, " ");
  const category = article?.category ?? "Egypt Stories";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg,#004d43 0%,#04140f 60%,#020b09 100%)", color: "#faf7f1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, letterSpacing: 6, color: "#ebc487" }}>
          MISR VISA · {category.toUpperCase()}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 70 ? 58 : 68, lineHeight: 1.1, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "rgba(250,247,241,0.7)" }}>
          <span>misrvisa.com</span>
          <span style={{ color: "#ebc487" }}>Egypt visa on arrival · USD 36 · OK-to-Board 24–48h</span>
        </div>
      </div>
    ),
    size,
  );
}
