import type { Metadata } from "next";
import { CONTACT_EMAIL, MANAGER_PHONE, WHATSAPP_NUMBER, SITE_URL, socialLinks } from "@/lib/content/social";
import { FAQS, SITE_NAME, VISA_FEE } from "@/lib/content/site";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL).replace(/\/$/, "");

export const CORE_KEYWORDS = [
  "Egypt visa",
  "Egypt visa on arrival",
  "Egypt visa on arrival 2026",
  "Egypt visa on arrival fee",
  "Egypt visa 36 dollars",
  "Egypt QR code visa",
  "Cairo airport visa",
  "OK to board Egypt",
  "Egypt visa for Nigerians",
  "Egypt visa for Africans",
  "Misr visa",
  "Egypt tourist visa",
  "EgyptAir OK to board",
  "Ethiopian Airlines OK to board Cairo",
  "travel to Egypt",
  "how to get Egypt visa on arrival",
  "how to apply for Egypt visa",
  "how much is Egypt visa on arrival",
  "Egypt visa price",
  "Egypt visa requirements",
  "can I get visa on arrival in Egypt",
  "Egypt visa for Ghanaians",
  "Cairo airport visa on arrival",
];

export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  return {
    title,
    description,
    keywords: [...keywords, ...CORE_KEYWORDS].slice(0, 24),
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE_NAME,
      title,
      description,
      url: path,
      locale: "en",
      ...(type === "article" ? { publishedTime, modifiedTime, authors: ["MISR VISA Editorial Team"] } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": `${siteUrl}/#organization`,
  name: SITE_NAME,
  alternateName: ["Misr Visa", "MisrVisa", "Misr Visa Egypt"],
  description:
    "MISR VISA is a Cairo-based travel assistance company helping African travelers visit Egypt: OK-to-Board in 24–48 hours, Egypt visa-on-arrival guidance (USD 36 QR visa at Cairo Airport), flights, hotels and airport pickup. MISR VISA is a private company, not a government body or embassy.",
  url: siteUrl,
  logo: `${siteUrl}/brand/logo-mark.png`,
  image: `${siteUrl}/opengraph-image`,
  foundingDate: "2022",
  founder: { "@type": "Person", name: "Fatima Muhammad Jidda", url: "https://fatimamjidda.com" },
  email: CONTACT_EMAIL,
  telephone: MANAGER_PHONE,
  address: { "@type": "PostalAddress", addressLocality: "Cairo", addressCountry: "EG" },
  areaServed: [
    { "@type": "Country", name: "Egypt" },
    { "@type": "Country", name: "Nigeria" },
    { "@type": "Country", name: "Ghana" },
    { "@type": "Country", name: "Sudan" },
    { "@type": "Country", name: "Chad" },
    { "@type": "Continent", name: "Africa" },
  ],
  knowsAbout: [
    "Egypt visa on arrival",
    "OK to Board",
    "Cairo International Airport QR code visa",
    "Travel to Egypt",
    "Egyptian history and tourism",
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
  sameAs: socialLinks.map((s) => s.href),
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: SITE_NAME,
  inLanguage: "en",
  publisher: { "@id": `${siteUrl}/#organization` },
};

export function faqJsonLd(items = FAQS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export const visaHowToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to get an Egypt visa on arrival with OK-to-Board",
  totalTime: "P2D",
  estimatedCost: { "@type": "MonetaryAmount", currency: VISA_FEE.currency, value: VISA_FEE.total },
  supply: [
    { "@type": "HowToSupply", name: "Passport valid for at least 6 months" },
    { "@type": "HowToSupply", name: "Confirmed ticket (EgyptAir or Ethiopian Airlines recommended)" },
  ],
  step: [
    { "@type": "HowToStep", name: "Send passport and ticket", text: "Send a clear passport copy and your confirmed ticket to MISR VISA." },
    { "@type": "HowToStep", name: "Receive OK-to-Board", text: "MISR VISA secures airline OK-to-Board, usually within 24–48 hours." },
    { "@type": "HowToStep", name: "Fly to Cairo", text: "Board your EgyptAir or Ethiopian Airlines flight to Cairo." },
    { "@type": "HowToStep", name: "Get the QR visa", text: "Pay USD 36 (USD 30 visa + USD 6 service charge) and receive the QR code visa at Cairo International Airport." },
  ],
};

export function JsonLdScript(data: object | object[]) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
