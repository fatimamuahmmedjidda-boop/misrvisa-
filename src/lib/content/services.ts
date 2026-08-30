export type ServiceSlug =
  | "visa-on-arrival"
  | "ticket-assistance"
  | "accommodation"
  | "airport-pickup"
  | "ok-to-board";

export interface Service {
  slug: ServiceSlug;
  dbValue:
    | "VISA_ON_ARRIVAL"
    | "TICKET_ASSISTANCE"
    | "ACCOMMODATION"
    | "AIRPORT_PICKUP"
    | "OK_TO_BOARD";
  name: string;
  shortDescription: string;
  whatItIs: string;
  whoItsFor: string;
  whatWeHelpWith: string[];
  whatYouNeed: string[];
  whatHappensNext: string[];
}

export const services: Service[] = [
  {
    slug: "visa-on-arrival",
    dbValue: "VISA_ON_ARRIVAL",
    name: "Visa-on-Arrival Assistance",
    shortDescription:
      "Guidance and support for eligible African travelers going through Egypt's Visa-on-Arrival process.",
    whatItIs:
      "Visa-on-Arrival is an entry option available to eligible travelers at Egyptian ports of entry. MISR VISA assists travelers in preparing for and navigating this process. We do not process embassy visas or e-Visas, and we cannot guarantee approval or entry — those decisions rest entirely with Egyptian immigration authorities.",
    whoItsFor:
      "African travelers who are eligible for Egypt's Visa-on-Arrival and are visiting for tourism, medical treatment, study, family visits, or other legitimate travel purposes.",
    whatWeHelpWith: [
      "Explaining the Visa-on-Arrival process step by step",
      "Reviewing your travel details before departure",
      "Guidance on what to expect at the port of entry",
      "Coordinating with related services (tickets, accommodation, airport pickup) around your visa timeline",
    ],
    whatYouNeed: [
      "A valid passport with sufficient remaining validity",
      "Confirmed or planned travel dates",
      "Your nationality and travel purpose",
      "A way to reach you (WhatsApp and email)",
    ],
    whatHappensNext: [
      "Submit the application form with your travel details",
      "Receive your unique MISR VISA tracking number",
      "Our team reviews your details and reaches out with guidance",
      "We support you through the process up to your arrival in Egypt",
    ],
  },
  {
    slug: "ticket-assistance",
    dbValue: "TICKET_ASSISTANCE",
    name: "Ticket / Flight Assistance",
    shortDescription:
      "Support finding and confirming flight options that fit your travel plans to Egypt.",
    whatItIs:
      "MISR VISA can assist travelers with flight and ticket-related guidance so your travel dates line up with the rest of your trip.",
    whoItsFor:
      "Travelers who need help identifying suitable flights to Egypt, especially alongside a Visa-on-Arrival application or other MISR VISA services.",
    whatWeHelpWith: [
      "Guidance on flight options and routing to Egypt",
      "Aligning travel dates with your visa and accommodation plans",
      "General support communicating with airlines where needed",
    ],
    whatYouNeed: [
      "Preferred travel dates and departure city",
      "Passport details for booking",
      "Contact information",
    ],
    whatHappensNext: [
      "Submit the application form and select Ticket Assistance",
      "Our team follows up with options and next steps",
      "You confirm your preferred arrangement",
    ],
  },
  {
    slug: "accommodation",
    dbValue: "ACCOMMODATION",
    name: "Accommodation Assistance",
    shortDescription:
      "Help arranging a place to stay in Egypt that fits your travel purpose and budget.",
    whatItIs:
      "MISR VISA helps travelers arrange accommodation in Egypt, whether for tourism, medical travel, study, or family visits.",
    whoItsFor:
      "Travelers who need support finding or confirming accommodation ahead of their trip to Egypt.",
    whatWeHelpWith: [
      "Recommending accommodation suited to your travel purpose and budget",
      "Coordinating booking details around your arrival date",
      "General guidance on neighborhoods and locations in Egypt",
    ],
    whatYouNeed: [
      "Travel dates and length of stay",
      "Budget range and preferences",
      "Number of travelers",
    ],
    whatHappensNext: [
      "Submit the application form and select Accommodation",
      "Our team shares suitable options",
      "You confirm your accommodation ahead of travel",
    ],
  },
  {
    slug: "airport-pickup",
    dbValue: "AIRPORT_PICKUP",
    name: "Airport Pickup",
    shortDescription:
      "Reliable pickup on arrival so you're met and supported from the moment you land.",
    whatItIs:
      "MISR VISA can arrange airport pickup so you have support and a familiar face waiting when you arrive in Egypt.",
    whoItsFor:
      "Travelers who want a smooth, supported arrival experience, especially first-time visitors to Egypt.",
    whatWeHelpWith: [
      "Arranging pickup timed to your flight arrival",
      "Coordinating transport to your accommodation",
      "On-arrival support for first-time travelers",
    ],
    whatYouNeed: [
      "Flight arrival details (date, time, flight number)",
      "Destination address in Egypt",
      "Contact information for the day of arrival",
    ],
    whatHappensNext: [
      "Submit the application form and select Airport Pickup",
      "Our team confirms pickup details ahead of your flight",
      "You're met on arrival and taken to your accommodation",
    ],
  },
  {
    slug: "ok-to-board",
    dbValue: "OK_TO_BOARD",
    name: "OK-to-Board Support",
    shortDescription:
      "Support with OK-to-Board requirements some airlines require before allowing boarding.",
    whatItIs:
      "Some airlines require an OK-to-Board confirmation before allowing a passenger to board a flight to Egypt. MISR VISA supports eligible travelers with this process where applicable. This is not available for every route or airline, and eligibility depends on your specific circumstances.",
    whoItsFor:
      "Travelers whose airline has flagged an OK-to-Board requirement for their journey to Egypt.",
    whatWeHelpWith: [
      "Explaining what OK-to-Board means for your specific booking",
      "Guidance on the documentation your airline may request",
      "Coordinating timing so it doesn't disrupt your travel plans",
    ],
    whatYouNeed: [
      "Your flight booking details",
      "Communication from your airline about the requirement, if any",
      "Passport and travel purpose details",
    ],
    whatHappensNext: [
      "Submit the application form and select OK-to-Board",
      "Our team reviews your booking and requirement",
      "We guide you through the steps your airline needs",
    ],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
