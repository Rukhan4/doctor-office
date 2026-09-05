import { test, expect } from "@playwright/test";


test.describe("appointment email delivery (live)", () => {
  test.skip(
    !process.env.RUN_EMAIL_SMOKE,
    "opt-in only — run with `npm run test:e2e:smoke` after exporting real Resend/Turnstile credentials",
  );

  test("a real appointment request is accepted end-to-end", async ({ page }) => {
    const marker = `E2E smoke test ${new Date().toISOString()}`;

    await page.goto("/contact");

    await page.getByLabel("Name").fill("Playwright Smoke Test");
    await page.getByLabel("Email").fill("smoke-test@example.com");
    await page.getByLabel("Phone").fill("868-555-0100");
    await page.getByLabel("Preferred time").selectOption("Morning");
    await page.getByLabel("Preferred date").fill("2026-09-20");
    await page.getByLabel("Reason for visit").fill("Automated smoke test — please disregard");
    await page.getByLabel("Additional notes").fill(marker);

    // Give the real Turnstile widget time to run its (usually invisible)
    // managed challenge before we try to submit.
    await page.waitForTimeout(3_000);

    await page.getByRole("button", { name: "Send" }).click();

    await expect(page.getByText("Appointment request sent successfully.")).toBeVisible({
      timeout: 15_000,
    });

    console.log(
      `Submitted OK. Check the practice inbox for a message from "Playwright Smoke Test" containing: ${marker}`,
    );
  });
});
