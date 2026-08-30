import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/fraunces/opsz.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  name: "MISR VISA",
  description:
    "Egypt Visa-on-Arrival assistance and traveler support for eligible African travelers.",
  url: siteUrl,
  foundingDate: "2022",
  areaServed: "Africa",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
