import { test, expect } from "@playwright/test";

test.describe("contact page", () => {
  test("shows practice contact points and links to the registration PDF", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: /book your appointment/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /open patient registration pdf/i })).toHaveAttribute(
      "href",
      "/patient-registration-form.pdf",
    );
  });

  test("submits the appointment form successfully", async ({ page }) => {
    await page.route("**/api/appointment", async (route) => {
      const request = route.request();
      expect(request.method()).toBe("POST");
      const body = request.postDataJSON();
      expect(body).toMatchObject({
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "868-555-0100",
        reason: "Annual checkup",
      });
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ message: "Appointment request sent successfully." }),
      });
    });

    await page.goto("/contact");

    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Phone").fill("868-555-0100");
    await page.getByLabel("Preferred time").selectOption("Morning");
    await page.getByLabel("Preferred date").fill("2026-09-20");
    await page.getByLabel("Reason for visit").fill("Annual checkup");

    await page.getByRole("button", { name: "Send" }).click();

    await expect(page.getByText("Appointment request sent successfully.")).toBeVisible();
  });

  test("surfaces the server error message when the request fails", async ({ page }) => {
    await page.route("**/api/appointment", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ message: "Please complete all required fields." }),
      });
    });

    await page.goto("/contact");

    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Phone").fill("868-555-0100");
    await page.getByLabel("Preferred time").selectOption("Morning");
    await page.getByLabel("Preferred date").fill("2026-09-20");
    await page.getByLabel("Reason for visit").fill("Annual checkup");

    await page.getByRole("button", { name: "Send" }).click();

    await expect(page.getByText("Please complete all required fields.")).toBeVisible();
  });

  test("does not submit when required fields are left blank", async ({ page }) => {
    let requestSent = false;
    await page.route("**/api/appointment", async (route) => {
      requestSent = true;
      await route.continue();
    });

    await page.goto("/contact");
    await page.getByRole("button", { name: "Send" }).click();

    // Native "required" validation should block submission client-side.
    await expect(page.getByLabel("Name")).toBeFocused();
    expect(requestSent).toBe(false);
  });
});

// API-level tests for /api/appointment live in e2e/api/appointment.api.spec.ts.
