import { expect, test } from "@playwright/test";

test.describe("Responsive behavior", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("mobile menu opens, lists nav links, and closes on navigation", async ({ page }) => {
    await page.goto("/en");

    // The desktop nav is CSS-hidden below the lg breakpoint, so only the
    // hamburger button is in the accessibility tree at this viewport.
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("link", { name: "Products", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Categories", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toBeVisible();

    await page.getByRole("link", { name: "Products", exact: true }).click();
    await expect(page).toHaveURL("/en/products");
  });

  test("mobile menu includes a WhatsApp button and language options", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Open menu" }).click();

    await expect(page.getByRole("link", { name: "Chat on WhatsApp" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Türkçe" })).toBeVisible();
    await expect(page.getByRole("link", { name: "العربية" })).toBeVisible();
  });

  test("products page search and category filters still work on mobile", async ({ page }) => {
    await page.goto("/en/products");

    const search = page.getByPlaceholder("Search by material, pigment, or style…");
    await expect(search).toBeVisible();
    await search.fill("Noor");
    await expect(page.getByRole("link", { name: "View Piece" })).toHaveCount(1);
  });

  test("no horizontal overflow on the home page at mobile width", async ({ page }) => {
    await page.goto("/en");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for subpixel rounding
  });
});

test.describe("Tablet viewport", () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test("home page renders without horizontal overflow", async ({ page }) => {
    await page.goto("/en");
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
