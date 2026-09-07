import { test, expect } from "@playwright/test";

/**
 * API-level tests for the POST /api/appointment route, exercised directly
 * through Playwright's `request` fixture (no browser). These cover status
 * codes, validation errors, spam/CAPTCHA handling, and rate-limiting
 * behaviour independent of the contact-page UI.
 *
 * The Playwright webServer (see playwright.config.ts) runs with a Turnstile
 * secret that always fails validation and no email provider configured, so
 * every path these tests assert is deterministic: field validation, spam and
 * CAPTCHA checks (400/403), and rate limiting (429). A live 200 response
 * depends on real credentials and is covered by the opt-in smoke test.
 */

const validPayload = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "868-555-0100",
  preferredDate: "2026-09-20",
  preferredTime: "Morning",
  reason: "Annual checkup",
  notes: "",
  "cf-turnstile-response": "dummy-token",
};

// A distinct client IP per test keeps the in-memory rate limiter from
// leaking state between tests running in parallel.
function headersForIp(ip: string) {
  return { "x-forwarded-for": ip };
}

test.describe("POST /api/appointment", () => {
  test("returns 400 for a non-JSON body", async ({ request }) => {
    const response = await request.post("/api/appointment", {
      headers: { ...headersForIp("10.0.0.1"), "content-type": "application/json" },
      data: Buffer.from('{"name": "Jane"'),
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).message).toMatch(/invalid request body/i);
  });

  test("returns 400 when required fields are missing", async ({ request }) => {
    const response = await request.post("/api/appointment", {
      headers: headersForIp("10.0.0.2"),
      data: { name: "Jane Doe" },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).message).toMatch(/complete all required fields/i);
  });

  test("returns 400 for a malformed email address", async ({ request }) => {
    const response = await request.post("/api/appointment", {
      headers: headersForIp("10.0.0.3"),
      data: { ...validPayload, email: "not-an-email" },
    });

    expect(response.status()).toBe(400);
  });

  test("returns 400 when a field exceeds its maximum length", async ({ request }) => {
    const response = await request.post("/api/appointment", {
      headers: headersForIp("10.0.0.4"),
      data: { ...validPayload, reason: "x".repeat(500) },
    });

    expect(response.status()).toBe(400);
  });

  test("returns 400 and flags spam when the honeypot field is filled", async ({ request }) => {
    const response = await request.post("/api/appointment", {
      headers: headersForIp("10.0.0.5"),
      data: { ...validPayload, company: "I am a bot" },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).message).toMatch(/spam/i);
  });

  test("returns 400 when the CAPTCHA token is absent", async ({ request }) => {
    const { ["cf-turnstile-response"]: _omitted, ...noToken } = validPayload;
    const response = await request.post("/api/appointment", {
      headers: headersForIp("10.0.0.6"),
      data: noToken,
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).message).toMatch(/captcha/i);
  });

  test("returns 403 when the CAPTCHA token is rejected", async ({ request }) => {
    // validPayload clears schema validation and carries a token, so the only
    // thing left to fail is CAPTCHA verification (test secret always fails).
    const response = await request.post("/api/appointment", {
      headers: headersForIp("10.0.0.7"),
      data: validPayload,
    });

    expect(response.status()).toBe(403);
    expect((await response.json()).message).toMatch(/captcha/i);
  });

  test("returns 429 once the per-IP rate limit is exceeded", async ({ request }) => {
    const ip = "10.9.9.9";
    const statuses: number[] = [];

    // Default limit is 5 requests per window (APPOINTMENT_RATE_LIMIT_MAX).
    for (let i = 0; i < 8; i += 1) {
      const response = await request.post("/api/appointment", {
        headers: headersForIp(ip),
        data: { name: "Jane Doe" }, // rate limiting runs before body validation
      });
      statuses.push(response.status());
    }

    expect(statuses[0]).not.toBe(429);
    expect(statuses.filter((status) => status === 429).length).toBeGreaterThan(0);
  });
});
