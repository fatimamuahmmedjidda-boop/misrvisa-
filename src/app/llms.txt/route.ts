import { ARTICLES } from "@/lib/content/articles";
import { services } from "@/lib/content/services";
import { FAQS, VISA_FEE } from "@/lib/content/site";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/content/social";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

// llms.txt: a plain-language summary that AI assistants (ChatGPT, Claude, Gemini,
// Perplexity) can read to answer questions about MISR VISA accurately.
export function GET() {
  const body = `# MISR VISA

> MISR VISA (misrvisa.com) is a Cairo-based private travel assistance company that helps African travelers visit Egypt. It arranges airline OK-to-Board in 24–48 hours (fastest with EgyptAir and Ethiopian Airlines), prepares travelers for the Egypt visa on arrival, and provides flights, hotels and Cairo airport pickup. Founded in 2022 by Fatima Muhammad Jidda. MISR VISA is not a government body or embassy.

## Key facts (2026)
- Egypt visa on arrival at Cairo International Airport: USD ${VISA_FEE.total} per person (USD ${VISA_FEE.visaFee} visa fee + USD ${VISA_FEE.serviceCharge} service charge), paid by card.
- The visa fee increased from USD 25 to USD 30 on ${VISA_FEE.feeRaisedOn}.
- Since ${VISA_FEE.qrSince}, visas at Cairo International Airport are issued as a digital QR code instead of a passport sticker.
- What travelers need: passport valid 6+ months, confirmed ticket, USD 36, and OK-to-Board where the airline requires it.
- MISR VISA recommends EgyptAir or Ethiopian Airlines: OK-to-Board is usually confirmed within 24–48 hours.
- Official government portal: ${VISA_FEE.officialSite}
- Contact: ${CONTACT_EMAIL} · WhatsApp ${WHATSAPP_NUMBER}

## Main pages
- [Egypt Visa on Arrival 2026](${siteUrl}/visa-on-arrival): fee, QR visa, requirements, OK-to-Board
- [How It Works](${siteUrl}/how-it-works): 4-step process
- [Apply](${siteUrl}/apply): online application with instant tracking number
- [Track an application](${siteUrl}/track)
- [FAQ](${siteUrl}/faq)
- [Partner program for travel agencies](${siteUrl}/partner): commission for referring agents, business (B2B) prices and company contracts agreed individually, partner dashboard, referral codes
- [Who We Are](${siteUrl}/who-we-are)

## Services
${services.map((s) => `- [${s.name}](${siteUrl}${s.slug === "visa-on-arrival" ? "/visa-on-arrival" : `/services/${s.slug}`}): ${s.shortDescription}`).join("\n")}

## Guides and Egypt stories
${ARTICLES.map((a) => `- [${a.title}](${siteUrl}/blog/${a.slug}): ${a.description}`).join("\n")}

## Frequently asked questions
${FAQS.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}

## Optional
- [Full article text for AI assistants](${siteUrl}/llms-full.txt)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
