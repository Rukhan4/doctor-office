# Doctor's Office Curepe

Frontend-first website for a local medical office. Built with Next.js, TypeScript, and Tailwind CSS, and designed for Vercel deployment.

## What is included

- Home, Services, Doctors / Team, and Contact pages
- Responsive header and footer
- Appointment request form that sends email through a server route
- No client-info storage or database

## Environment variables

Copy `.env.example` to `.env.local` and set:

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_TO`
- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `APPOINTMENT_RATE_LIMIT_WINDOW_MS` (optional, default `600000`)
- `APPOINTMENT_RATE_LIMIT_MAX` (optional, default `5`)
- `CONTACT_PHONE`
- `PRACTICE_ADDRESS`
- `NEXT_PUBLIC_GA_ID` (optional, for Google Analytics 4)

## Run locally

```bash
npm install
npm run dev
```

## Email setup

The appointment form posts to `/api/appointment`, which sends mail through Resend.
Set `EMAIL_FROM` to a verified sender address in your Resend account.

## Analytics and conversions

If `NEXT_PUBLIC_GA_ID` is set, the site loads Google Analytics 4 globally.

Tracked events include:

- `book_cta_click`
- `map_click`
- `package_info_click`

Use these as conversion events in GA4.

## Local SEO and profile checklist

- Keep business name, phone, and address exactly consistent across the site and your Google Business Profile.
- In your Google Business Profile dashboard, add `https://doctorsofficecurepe.com` as the website URL.
- Use the same Google Business profile link in your social listings and directory listings.
- Add local directory listings (e.g. local business directories, medical directories) to build backlinks.

## Notes

The starter copy is intentionally easy to replace with the final office content.
Once the full profile text is available, update `lib/content.ts` and refine the page sections.