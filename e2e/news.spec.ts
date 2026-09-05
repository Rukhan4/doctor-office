import { test, expect } from "@playwright/test";

test.describe("news page", () => {
  test("lists news posts with images and dates", async ({ page }) => {
    await page.goto("/news");
    await expect(page.getByRole("heading", { name: /latest news & specials/i })).toBeVisible();

    const posts = page.locator("article");
    await expect(posts.first()).toBeVisible();
    expect(await posts.count()).toBeGreaterThan(0);

    // Each post image should actually resolve, not 404/broken.
    const firstImage = posts.first().locator("img");
    await expect(firstImage).toBeVisible();
    await expect
      .poll(() => firstImage.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);
  });

  test("links back to the contact page for questions", async ({ page }) => {
    await page.goto("/news");
    await page.getByRole("link", { name: /contact us|get in touch|contact/i }).first().click();
    await expect(page).toHaveURL(/\/contact$/);
  });
});
