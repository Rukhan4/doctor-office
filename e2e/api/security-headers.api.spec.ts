import { test, expect } from "@playwright/test";

/**
 * Verifies the security headers configured in next.config.mjs are actually
 * served on responses. Checked at the HTTP level so it covers every route,
 * not just pages a browser test happens to visit.
 */

const PATHS = ["/", "/contact", "/news"];

test.describe("security headers", () => {
  for (const path of PATHS) {
    test(`${path} is served with the expected security headers`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);

      const headers = response.headers();

      expect(headers["content-security-policy"]).toContain("default-src 'self'");
      expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["x-frame-options"]).toBe("DENY");
      expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
      expect(headers["permissions-policy"]).toContain("camera=()");
    });
  }
});
