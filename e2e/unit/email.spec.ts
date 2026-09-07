import { test, expect } from "@playwright/test";
import { escapeHtml } from "../../lib/email";

/**
 * Appointment details are interpolated into an HTML email in lib/email.ts.
 * escapeHtml is the guard against a submitted value injecting markup or
 * script into that email, so it is unit-tested directly.
 */

test.describe("escapeHtml", () => {
  test("neutralises HTML tags", () => {
    expect(escapeHtml("<script>alert(1)</script>")).toBe(
      "&lt;script&gt;alert(1)&lt;/script&gt;",
    );
  });

  test("escapes ampersands and quotes", () => {
    expect(escapeHtml('Tom & Jerry said "hi"')).toBe(
      "Tom &amp; Jerry said &quot;hi&quot;",
    );
  });

  test("escapes ampersands before entities so output cannot be double-decoded", () => {
    expect(escapeHtml("<&>")).toBe("&lt;&amp;&gt;");
  });

  test("leaves plain text untouched", () => {
    expect(escapeHtml("Annual checkup at 9am")).toBe("Annual checkup at 9am");
  });
});
