import { test, expect } from "@playwright/test";

const navLinks: Array<{ label: string; path: string; heading: RegExp }> = [
  { label: "Services", path: "/services", heading: /services/i },
  { label: "Packages", path: "/packages", heading: /packages/i },
  { label: "News", path: "/news", heading: /news/i },
  { label: "Our Team", path: "/doctors", heading: /doctors|team/i },
  { label: "Contact", path: "/contact", heading: /contact|appointment/i },
];

test.describe("site navigation", () => {
  test("home page loads with practice name and hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/.+/);
    await expect(page.getByRole("link", { name: /primecare medical centre/i })).toBeVisible();
  });

  for (const link of navLinks) {
    test(`nav link "${link.label}" navigates to ${link.path}`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("navigation").getByRole("link", { name: link.label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${link.path}$`));
      await expect(page.getByRole("main")).toContainText(link.heading);
    });
  }

  test("mobile menu toggles and links work", async ({ page, isMobile }) => {
    test.skip(!isMobile, "menu toggle only rendered on small viewports");
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("link", { name: "Contact", exact: true }).click();
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("patient registration form page redirects to the PDF", async ({ page }) => {
    // The browser treats the PDF as a download rather than a navigable page,
    // so wait for the download event instead of a normal "load".
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.goto("/patient-registration-form").catch(() => undefined),
    ]);
    expect(download.url()).toContain("/patient-registration-form.pdf");
  });
});
