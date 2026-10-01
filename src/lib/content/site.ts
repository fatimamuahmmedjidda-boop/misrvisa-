// Single source of truth for the facts repeated across pages, structured data,
// llms.txt and social previews. Update a fact here and every page follows.

export const SITE_NAME = "MISR VISA";

export const VISA_FEE = {
  total: 36,
  visaFee: 30,
  serviceCharge: 6,
  currency: "USD",
  airport: "Cairo International Airport",
  qrSince: "1 August 2026",
  feeRaisedOn: "1 March 2026",
  officialSite: "visaonarrival.gov.eg",
};

export const OK_TO_BOARD_HOURS = "24–48 hours";

export const RECOMMENDED_AIRLINES = [
  {
    name: "EgyptAir",
    code: "MS",
    hub: "Cairo (CAI)",
    note: "Egypt's national carrier flies direct into Cairo, so OK-to-Board confirmation is usually the fastest.",
  },
  {
    name: "Ethiopian Airlines",
    code: "ET",
    hub: "Addis Ababa (ADD)",
    note: "Africa's largest network connects West, East and Central Africa to Cairo with one smooth transfer.",
  },
];

export const REQUIREMENTS = [
  {
    title: "Valid passport",
    body: "At least 6 months of validity from your arrival date, with blank pages for entry stamps.",
  },
  {
    title: "Confirmed return ticket",
    body: "A confirmed booking. We recommend EgyptAir or Ethiopian Airlines for the fastest OK-to-Board.",
  },
  {
    title: "Payment in advance",
    body: "Pay the OK-to-Board fee in advance — we tell you today's price. The USD 36 visa is paid later, when you land in Cairo.",
  },
];

export const OTHER_AIRLINES = [
  {
    name: "Turkish Airlines & Emirates",
    status: "Accepted",
    ok: true,
    note: "OK-to-Board is possible, but these airlines are less flexible and slower to communicate. If a problem happens at departure we are not responsible. Once you land in Cairo, we are fully responsible.",
  },
  {
    name: "Qatar Airways",
    status: "Not accepted",
    ok: false,
    note: "OK-to-Board is not given for Qatar Airways flights. Please book EgyptAir or Ethiopian Airlines instead.",
  },
];

export const PROCESSING_OPTIONS = [
  {
    name: "Standard",
    time: "Within 24 hours",
    body: "Submit today and we send your OK-to-Board by the next day — for example, apply today at 5 PM and receive it tomorrow by 2 PM. We always try our best within 24 hours (48 hours maximum), then you travel.",
  },
  {
    name: "VIP same day",
    time: "Within 12 hours",
    body: "Need to fly today? Submit today and get your OK-to-Board within 12 hours, so you can travel the same day without stress. VIP has a different price.",
  },
];

export const JOURNEY_STEPS = [
  {
    n: "01",
    title: "Send passport & ticket",
    body: "Tell us your nationality and share your passport and confirmed EgyptAir or Ethiopian Airlines ticket. We reply with today's OK-to-Board price.",
  },
  {
    n: "02",
    title: "OK-to-Board in 24–48h",
    body: "Our Cairo team handles your OK-to-Board with the airline and keeps you updated with a private tracking number.",
  },
  {
    n: "03",
    title: "Fly to Cairo",
    body: "Board with confidence. Airport pickup and hotel arrangements can be ready before you land.",
  },
  {
    n: "04",
    title: "USD 36 QR visa on arrival",
    body: "Receive your visa as a digital QR code at Cairo International Airport and step into Egypt.",
  },
];

export const NAV_LINKS = [
  { href: "/visa-on-arrival", label: "Visa on Arrival" },
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/blog", label: "Egypt Stories" },
  { href: "/partner", label: "Partners" },
  { href: "/track", label: "Track" },
];

export const FAQS: { q: string; a: string; category: string }[] = [
  {
    category: "Visa on Arrival",
    q: "How much is the Egypt visa on arrival in 2026?",
    a: "At Cairo International Airport the visa on arrival is issued as a digital QR code and costs USD 36 per person: a USD 30 visa fee plus a USD 6 service charge. Egypt raised the visa fee from USD 25 to USD 30 on 1 March 2026. Fees are set by the Egyptian authorities and can change.",
  },
  {
    category: "Visa on Arrival",
    q: "What do I need to get an Egypt visa on arrival?",
    a: "For MISR VISA travelers the essentials are a passport valid for at least 6 months, a confirmed return ticket, and USD 36 for the QR visa at Cairo Airport. Travelers from many African countries also need OK-to-Board confirmation from their airline before flying, which MISR VISA arranges.",
  },
  {
    category: "OK-to-Board",
    q: "What is OK-to-Board for Egypt?",
    a: "OK-to-Board is a confirmation some airlines require before they let certain passengers fly to Egypt. Without it, check-in staff can refuse boarding even when you hold a ticket. MISR VISA secures OK-to-Board for eligible travelers, usually within 24 to 48 hours.",
  },
  {
    category: "OK-to-Board",
    q: "Which airline is best for Egypt visa on arrival?",
    a: "EgyptAir or Ethiopian Airlines — no problems and OK-to-Board in 24 to 48 hours. Turkish Airlines and Emirates are accepted, but they are less flexible, so if a problem happens at departure we are not responsible (in Cairo we are fully responsible). Qatar Airways is not accepted: OK-to-Board is not given for Qatar Airways flights.",
  },
  {
    category: "OK-to-Board",
    q: "How long does OK-to-Board take?",
    a: "Standard: submit today and receive your OK-to-Board by the next day — we try our best within 24 hours, 48 hours maximum. VIP same day: submit today and get OK-to-Board within 12 hours so you can travel the same day. VIP has a different price, and every traveler receives their own quote.",
  },
  {
    category: "Visa on Arrival",
    q: "Is the Egypt visa still a sticker in my passport?",
    a: "No. Since 1 August 2026 visas at Cairo International Airport are issued as a QR code instead of a paper sticker. The system currently applies at Cairo Airport, including passengers who connect onward to another Egyptian city.",
  },
  {
    category: "Services",
    q: "Is MISR VISA a government website?",
    a: "No. MISR VISA is a private travel assistance company based in Cairo. We are not the Egyptian government or an embassy, and immigration decisions are always made by the Egyptian authorities. The official visa-on-arrival portal is visaonarrival.gov.eg.",
  },
  {
    category: "OK-to-Board",
    q: "How much does OK-to-Board cost?",
    a: "The OK-to-Board price is not fixed — it changes day by day and depends on your nationality and airline. Send us your nationality, a copy of your passport and your confirmed ticket, and we will tell you today's price before you pay anything. The USD 36 visa on arrival is a separate fee paid at Cairo Airport.",
  },
  {
    category: "Services",
    q: "How much does MISR VISA charge?",
    a: "Prices depend on the service and change with daily rates. For OK-to-Board, share your nationality, passport and ticket to receive today's price. For flights, hotels and airport pickup we send a clear quote on WhatsApp before you pay anything.",
  },
  {
    category: "Services",
    q: "How do I track my application?",
    a: "After you apply you receive a MISR VISA tracking number. Enter it on the Track page, or log in to your traveler account, to see your live status from Received to Ready.",
  },
  {
    category: "Partners",
    q: "Can travel agencies partner with MISR VISA?",
    a: "Yes. Travel agencies, tour operators, student recruiters and medical-travel facilitators can partner with MISR VISA. Agents earn commission on every client they refer, agencies and companies get business prices that differ from individual traveler prices, and companies can sign a partnership contract. Rates are agreed personally — contact us on WhatsApp or fill in the partner form. Partners also get a dashboard and referral code to follow their travelers.",
  },
  {
    category: "Visa on Arrival",
    q: "Is it possible to get a visa on arrival in Egypt?",
    a: "Yes. Egypt issues visas on arrival at Cairo International Airport as a digital QR code for USD 36. Eligibility depends on your nationality, and many African travelers must first get airline OK-to-Board before flying. MISR VISA tells you what applies to your passport and arranges OK-to-Board.",
  },
  {
    category: "Visa on Arrival",
    q: "How do I get an Egypt visa on arrival?",
    a: "1) Send MISR VISA your nationality, passport and ticket (EgyptAir or Ethiopian Airlines recommended). 2) Pay the OK-to-Board fee (today's price). 3) Receive OK-to-Board — within 24 hours, or within 12 hours with VIP. 4) Fly to Cairo and pay USD 36 for your QR visa on arrival.",
  },
  {
    category: "Visa on Arrival",
    q: "How do I apply for an Egypt visa?",
    a: "There are two ways: the Egypt e-Visa, applied for online before travel on the official portal visa2egypt.gov.eg, or the visa on arrival at Cairo Airport (USD 36 QR visa). MISR VISA specializes in the visa on arrival route with OK-to-Board — apply on misrvisa.com/apply or on WhatsApp.",
  },
  {
    category: "Visa on Arrival",
    q: "Do I need a visa to travel to Egypt?",
    a: "Most foreign visitors need a visa to enter Egypt. Many can get it on arrival at Cairo International Airport for USD 36, and some nationalities also need airline OK-to-Board before flying. Send us your nationality and we will confirm exactly what you need.",
  },
  {
    category: "Visa on Arrival",
    q: "How long can I stay in Egypt with a visa on arrival?",
    a: "The Egypt visa on arrival is a single-entry tourist visa, normally valid for a stay of up to 30 days. Always check the dates on your visa when you arrive.",
  },
  {
    category: "Visa on Arrival",
    q: "Can Nigerians, Ghanaians and Sudanese get an Egypt visa on arrival?",
    a: "Travelers from Nigeria, Ghana, Sudan, Chad and other African countries travel to Egypt with MISR VISA. The key step is airline OK-to-Board before departure; after landing you pay USD 36 for the QR visa. Rules can change by nationality, so send us your passport details to confirm.",
  },
];
