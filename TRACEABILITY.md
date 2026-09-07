# Requirements Traceability Matrix

Maps each requirement to the automated test(s) that verify it. Test IDs match
the `test(...)` titles in the referenced files.

| Req ID | Requirement | Type | Test file | Level | Status |
|---|---|---|---|---|---|
| FR-01 | Home page displays practice name and hero content | Functional | `e2e/navigation.spec.ts` | E2E/UI | Automated |
| FR-02 | Primary nav routes to Services, Packages, News, Team, Contact | Functional | `e2e/navigation.spec.ts` | E2E/UI | Automated |
| FR-03 | Mobile menu toggles and its links work | Functional | `e2e/navigation.spec.ts` | E2E/UI | Automated |
| FR-04 | `/patient-registration-form` redirects to the PDF | Functional | `e2e/navigation.spec.ts` | E2E/UI | Automated |
| FR-05 | Contact page shows contact points and links to the registration PDF | Functional | `e2e/contact.spec.ts` | E2E/UI | Automated |
| FR-06 | Valid appointment submission shows a success message | Functional | `e2e/contact.spec.ts` | E2E/UI (API mocked) | Automated |
| FR-07 | Server error is surfaced to the user | Functional | `e2e/contact.spec.ts` | E2E/UI (API mocked) | Automated |
| FR-08 | Empty required fields block client-side submission | Functional | `e2e/contact.spec.ts` | E2E/UI | Automated |
| FR-09 | News page lists posts with images and dates | Functional | `e2e/news.spec.ts` | E2E/UI | Automated |
| FR-10 | News page links back to the contact page | Functional | `e2e/news.spec.ts` | E2E/UI | Automated |
| FR-11 | Live Turnstile -> API -> email chain delivers a real request | Functional | `e2e/smoke-email.spec.ts` | E2E smoke | Opt-in (`RUN_EMAIL_SMOKE`) |
| API-01 | `POST /api/appointment` rejects a non-JSON body with 400 | Functional | `e2e/api/appointment.api.spec.ts` | API | Automated |
| API-02 | Route rejects an incomplete payload with 400 | Functional | `e2e/api/appointment.api.spec.ts` | API | Automated |
| API-03 | Route validates email format | Functional | `e2e/api/appointment.api.spec.ts` | API | Automated |
| API-04 | Route enforces maximum field lengths (zod schema) | Functional | `e2e/api/appointment.api.spec.ts` | API | Automated |
| API-05 | Honeypot (`company`) field triggers spam rejection (400) | Security | `e2e/api/appointment.api.spec.ts` | API | Automated |
| API-06 | Missing CAPTCHA token is rejected with 400 | Security | `e2e/api/appointment.api.spec.ts` | API | Automated |
| API-07 | Invalid CAPTCHA token is rejected with 403 | Security | `e2e/api/appointment.api.spec.ts` | API | Automated |
| API-08 | Per-IP rate limit returns 429 when exceeded | Security / NFR | `e2e/api/appointment.api.spec.ts` | API | Automated (in-memory limiter) |
| API-09 | Redis-backed limiter is used when Upstash is configured | Security / NFR | — | — | Gap (needs an Upstash instance) |
| SEC-01 | Security headers (CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy) served on all routes | Security | `e2e/api/security-headers.api.spec.ts` | API | Automated |
| SEC-02 | Appointment values are HTML-escaped in the email body (XSS) | Security | `e2e/unit/email.spec.ts` | Unit | Automated |
| NFR-01 | Performance score >= 0.85 on Home / Contact / News | Non-functional | `lighthouserc.json` | Lighthouse CI | Automated |
| NFR-02 | Accessibility score >= 0.90 on key pages | Non-functional | `lighthouserc.json` | Lighthouse CI | Automated |
| NFR-03 | Best-practices score >= 0.90 | Non-functional | `lighthouserc.json` | Lighthouse CI | Automated |
| NFR-04 | SEO score >= 0.90 | Non-functional | `lighthouserc.json` | Lighthouse CI | Automated |
| NFR-05 | Site stays responsive at 10 concurrent users (p95 < 800ms, < 1% errors) | Non-functional | `k6/load-test.js` | Load test | Automated |
| NFR-06 | Key routes return 200 under load | Non-functional | `k6/load-test.js` | Load test | Automated |
| INT-01 | Full Playwright suite runs on every push / PR | Process | `.github/workflows/e2e.yml` | CI | Automated |
| INT-02 | Lighthouse gate runs on every push / PR | Process | `.github/workflows/lighthouse.yml` | CI | Automated |
| INT-03 | Load test runs on every push / PR | Process | `.github/workflows/load-test.yml` | CI | Automated |

## Coverage summary

- Functional: 16 / 16 requirements automated (FR-11 is opt-in).
- Security: 5 / 6 automated. Open gap: API-09 (Redis limiter path) needs a live
  Upstash instance to exercise; the in-memory fallback that runs in every other
  environment is covered by API-08.
- Non-functional: 6 / 6 automated (Lighthouse + k6).
- CI / process: 3 / 3 automated.
