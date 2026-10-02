import { z } from "zod";

// Email addresses are normalised here (trim + lowercase) so that the value
// written at sign-up is byte-identical to the value looked up at login, at
// password reset and when an application re-uses an existing account. Without
// this, "Fatima@Gmail.com" and "fatima@gmail.com" are two different rows to
// Postgres and a reset link would silently never be sent.

const serviceEnum = z.enum([
  "VISA_ON_ARRIVAL",
  "TICKET_ASSISTANCE",
  "ACCOMMODATION",
  "AIRPORT_PICKUP",
  "OK_TO_BOARD",
]);

export const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(200),
  nationality: z.string().trim().min(2, "Nationality is required").max(100),
  whatsapp: z.string().trim().min(6, "WhatsApp number is required").max(30),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
  travelDate: z.string().trim().optional().or(z.literal("")),
  travelPurpose: z.string().trim().min(2, "Travel purpose is required").max(200),
  service: serviceEnum,
  additionalInfo: z.string().trim().max(2000).optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters").max(200).optional().or(z.literal("")),
  referralCode: z.string().trim().max(50).optional().or(z.literal("")),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const partnerSchema = z.object({
  companyName: z.string().trim().min(2, "Company/agency name is required").max(200),
  contactPerson: z.string().trim().min(2, "Contact person is required").max(200),
  country: z.string().trim().min(2, "Country is required").max(100),
  phone: z.string().trim().min(6, "Phone / WhatsApp is required").max(30),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
  website: z.string().trim().max(300).optional().or(z.literal("")),
  businessType: z.string().trim().min(2, "Type of business is required").max(200),
  expectedVolume: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type PartnerInput = z.infer<typeof partnerSchema>;

export const trackSchema = z.object({
  trackingId: z
    .string()
    .trim()
    .min(6)
    .max(30)
    .regex(/^MVR-\d{4}-\d{4,}$/i, "Enter a valid tracking number, e.g. MVR-2026-0001"),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(200),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
  subject: z.string().trim().min(2, "Subject is required").max(200),
  message: z.string().trim().min(5, "Message is required").max(2000),
});

export const adminLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const blogPostSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  excerpt: z.string().trim().min(2, "Excerpt is required").max(400),
  content: z.string().trim().min(10, "Content is required"),
  featuredImage: z.string().trim().max(500).optional().or(z.literal("")),
  category: z.string().trim().min(2, "Category is required").max(100),
  author: z.string().trim().max(200).optional().or(z.literal("")),
  seoTitle: z.string().trim().max(200).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(300).optional().or(z.literal("")),
  published: z.boolean().optional(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const customerRegisterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

export const adminPartnerSchema = z.object({
  name: z.string().trim().min(2, "Partner name is required").max(200),
  email: z.string().trim().toLowerCase().email("Enter a valid email address").max(200),
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
  commissionPercent: z.coerce.number().min(0).max(100),
});

export const testimonialSchema = z.object({
  customerName: z.string().trim().min(2, "Customer name is required").max(200),
  countryFlag: z.string().trim().max(10).optional().or(z.literal("")),
  quote: z.string().trim().min(5, "Quote is required").max(1000),
  published: z.boolean().optional(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
