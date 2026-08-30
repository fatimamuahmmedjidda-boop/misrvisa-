# MISR VISA — Website

Egypt Visa-on-Arrival assistance and traveler support website for MISR VISA.
Next.js (App Router) + TypeScript + Tailwind CSS v4 + Prisma.

## What's built

- **Public site**: Home, About, Services (+ individual service pages), Visa-on-Arrival
  (flagship page), How It Works, FAQ, Blog / Visa News, Contact, Apply, Track Application,
  Partner With Us.
- **Application system**: `/apply` submits to the database, generates a unique tracking
  number (`MVR-2026-0001` format), and shows a confirmation.
- **Tracking**: `/track` looks up an application by tracking number and shows status only
  (no private customer data is exposed publicly).
- **Partner leads**: `/partner` form saves partner/agency inquiries.
- **Contact form**: `/contact` saves messages to the database.
- **Admin dashboard** (`/admin`, behind login): overview counts, applications list with
  status/notes editing, partner leads list with status editing, blog post CRUD (with a
  publish toggle), and testimonials management (placeholders vs. real, published toggle).
- **SEO**: per-page metadata, Open Graph, canonical URLs, `sitemap.xml`, `robots.txt`,
  JSON-LD (Organization on every page, FAQPage on `/faq`).
- **Security**: admin auth via a signed, httpOnly session cookie (`jose` + `bcryptjs`),
  route protection in `src/proxy.ts` (Next's current "proxy"/middleware convention) for
  `/admin/*` and `/api/admin/*`, server-side validation with `zod` on every form endpoint,
  no secrets in client code.

## Getting started

```bash
npm install
cp .env.example .env      # already done if you're continuing this session
npm run db:migrate        # creates the local SQLite database + tables
npm run db:seed           # seeds FAQ content, placeholder testimonials, and the admin user
npm run dev
```

Open http://localhost:3000. Admin login is at `/admin/login` using the
`ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env` (defaults to
`admin@misrvisa.com` / `ChangeMe123!` — **change this before going live**).

### Environment variables

See `.env.example`. Required:

- `DATABASE_URL` — SQLite file locally (`file:./dev.db`); a Postgres connection string in
  production (see Deployment below).
- `SESSION_SECRET` — long random string signing admin session cookies. Generate with
  `openssl rand -base64 32`.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — bootstrap admin account, read by `npm run db:seed`.
- `NEXT_PUBLIC_SITE_URL` — used for canonical URLs, sitemap, and Open Graph tags.

## Database

Schema lives in `prisma/schema.prisma`: `Customer`, `Application`, `PartnerApplication`,
`ContactMessage`, `BlogPost`, `Faq`, `Testimonial`, `AdminUser`. Status/service/type fields
are plain strings (not native enums) with the allowed values documented in the schema
and enforced in `src/lib/validation.ts` and `src/lib/statuses.ts` — this keeps the same
schema file working on both SQLite (no enum support) and Postgres.

Useful commands:

```bash
npm run db:migrate   # create/apply a migration locally
npm run db:seed      # (re)run the seed script
npm run db:studio    # browse the database in Prisma Studio
```

## Deployment (Vercel)

SQLite's local file does not persist on Vercel's serverless filesystem, so before
deploying:

1. Create a Postgres database (Neon, Vercel Postgres, or Supabase all work).
2. In `prisma/schema.prisma`, change the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Set `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and
   `NEXT_PUBLIC_SITE_URL` (your real domain) as environment variables in the Vercel
   project settings — never commit these.
4. Push to GitHub and import the repo in Vercel, or run `vercel --prod`.
5. After the first deploy, run migrations and the seed against production:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
6. Connect your domain (e.g. registered via Hostinger) to the Vercel project — point its
   DNS at Vercel; no separate hosting is needed.

## Known limitations / next steps

- Blog has no seeded articles yet — add real posts via `/admin/blog`.
- Testimonials start empty (placeholders only) — add real ones via `/admin/testimonials`.
- No customer login/account portal yet (V1 tracking is by tracking number, no password) —
  intentionally deferred per the build brief ("do not overbuild in V1").
- No outbound email/WhatsApp notifications are wired up yet (applications and messages are
  stored and visible in `/admin`, but nothing is auto-sent to the customer or the team). If
  the business needs automated emails, adding [Resend](https://resend.com) or similar to
  the application/contact API routes is the natural next step.
- Pricing, company history beyond what's in this repo, and brand fonts came from the build
  brief and premium defaults (Fraunces + Inter, self-hosted) — swap in real brand fonts by
  replacing the `@fontsource-variable/*` imports in `src/app/layout.tsx` if MISR VISA has
  approved fonts on file elsewhere.
