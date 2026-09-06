import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    // API tests hit the route directly and don't need a browser, so they run
    // once in their own project rather than across every browser.
    { name: "api", testMatch: /e2e\/api\/.*\.spec\.ts/ },
    { name: "chromium", testIgnore: /e2e\/api\//, use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", testIgnore: /e2e\/api\//, use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", testIgnore: /e2e\/api\//, use: { ...devices["Desktop Safari"] } },
    { name: "mobile-safari", testIgnore: /e2e\/api\//, use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      // Cloudflare's published always-passes Turnstile test keys, used unless
      // real credentials are already exported (e.g. for the email smoke test
      // in e2e/smoke-email.spec.ts, run via `npm run test:e2e:smoke`).
      // https://developers.cloudflare.com/turnstile/troubleshooting/testing/
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
      TURNSTILE_SECRET: process.env.TURNSTILE_SECRET || "1x0000000000000000000000000000AA",
      RESEND_API_KEY: process.env.RESEND_API_KEY || "",
      EMAIL_FROM: process.env.EMAIL_FROM || "",
      EMAIL_TO: process.env.EMAIL_TO || "",
    },
  },
});
