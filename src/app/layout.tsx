import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces/opsz.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL, WHATSAPP_NUMBER, MANAGER_PHONE } from "@/lib/content/social";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MISR VISA — Egypt Visa-on-Arrival Assistance for African Travelers",
    template: "%s | MISR VISA",
  },
  description:
    "MISR VISA helps eligible African travelers with Egypt Visa-on-Arrival assistance, ticket support, accommodation, airport pickup, and OK-to-Board guidance.",
  keywords: [
    "Egypt visa",
    "Egypt Visa-on-Arrival",
    "Egypt visa assistance",
    "visa on arrival Egypt for Africans",
    "Egypt travel accommodation",
    "Cairo airport pickup",
    "OK to Board Egypt",
    "Egypt visa help Nigeria",
    "Egypt tourist visa assistance",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    siteName: "MISR VISA",
    title: "MISR VISA — Egypt Visa-on-Arrival Assistance for African Travelers",
    description:
      "Trusted traveler support for Egypt: Visa-on-Arrival assistance, tickets, accommodation, airport pickup, and OK-to-Board guidance.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "MISR VISA — Egypt Visa-on-Arrival Assistance",
    description:
      "Trusted traveler support for Egypt: Visa-on-Arrival assistance, tickets, accommodation, airport pickup, and OK-to-Board guidance.",
  },
  alternates: {
    canonical: "/",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": `${siteUrl}/#organization`,
  name: "MISR VISA",
  description:
    "MISR VISA provides Egypt Visa-on-Arrival assistance, ticket support, accommodation, airport pickup, and OK-to-Board guidance for eligible African travelers. MISR VISA is a private service provider, not a government body or embassy.",
  url: siteUrl,
  logo: `${siteUrl}/brand/logo-mark.png`,
  image: `${siteUrl}/brand/logo-mark.png`,
  foundingDate: "2022",
  email: CONTACT_EMAIL,
  telephone: MANAGER_PHONE,
  areaServed: [
    { "@type": "Country", name: "Nigeria" },
    { "@type": "Country", name: "Ghana" },
    { "@type": "Country", name: "Sudan" },
    { "@type": "Country", name: "Chad" },
    { "@type": "Continent", name: "Africa" },
  ],
  knowsLanguage: ["en", "ar"],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: CONTACT_EMAIL,
      telephone: WHATSAPP_NUMBER,
      availableLanguage: ["English", "Arabic"],
      areaServed: "Africa",
    },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Egypt traveler support services",
    itemListElement: [
      "Egypt Visa-on-Arrival Assistance",
      "Ticket / Flight Assistance",
      "Accommodation Assistance",
      "Airport Pickup",
      "OK-to-Board Support",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name, provider: { "@id": `${siteUrl}/#organization` } },
    })),
  },
  sameAs: [
    "https://www.instagram.com/misrvisa",
    "https://www.facebook.com/share/1BsiqaCvLj/",
    "https://www.tiktok.com/@misrvisa",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: siteUrl,
  name: "MISR VISA",
  publisher: { "@id": `${siteUrl}/#organization` },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
