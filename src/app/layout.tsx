import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces/opsz.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import MarketingTags from "@/components/site/MarketingTags";
import { CORE_KEYWORDS, JsonLdScript, organizationJsonLd, siteUrl, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

const defaultTitle = "Egypt Visa on Arrival USD 36 · OK-to-Board in 24–48h | MISR VISA";
const defaultDescription =
  "Travel to Egypt with MISR VISA. OK-to-Board in 24–48 hours with EgyptAir or Ethiopian Airlines, the USD 36 QR visa on arrival at Cairo Airport, flights, hotels and airport pickup for African travelers.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: "%s | MISR VISA" },
  description: defaultDescription,
  applicationName: "MISR VISA",
  category: "travel",
  keywords: CORE_KEYWORDS,
  authors: [{ name: "Fatima Muhammad Jidda", url: "https://www.fatimamjidda.com" }],
  creator: "Fatima Muhammad Jidda",
  publisher: "MISR VISA",
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    siteName: "MISR VISA",
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
    locale: "en",
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: defaultDescription },
  alternates: { canonical: "/" },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: "#021510",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={JsonLdScript([organizationJsonLd, websiteJsonLd])}
        />
        {children}
        <Analytics />
        <SpeedInsights />
        <MarketingTags />
      </body>
    </html>
  );
}
