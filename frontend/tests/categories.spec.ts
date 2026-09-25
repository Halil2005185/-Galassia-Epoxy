import { expect, test } from "@playwright/test";

test.describe("Categories index page", () => {
  test("shows the four curated collections with working links", async ({ page }) => {
    await page.goto("/en/categories");

    await expect(page.getByRole("heading", { name: "The Collections" })).toBeVisible();
    await expect(page.getByText("Catalog Vol. II • Editorial Index")).toBeVisible();

    const exploreLinks = page.getByRole("link", { name: /^Explore .+ \(\d+ Pieces\)$/ });
    await expect(exploreLinks).toHaveCount(4);

    await exploreLinks.filter({ hasText: "River Tables" }).click();
    await expect(page).toHaveURL("/en/categories/dining-river-tables");
  });

  test("Commission Specs buttons open WhatsApp", async ({ page }) => {
    await page.goto("/en/categories");

    const commissionButtons = page.getByRole("link", { name: "Commission Specs" });
    expect(await commissionButtons.count()).toBeGreaterThan(0);
    await expect(commissionButtons.first()).toHaveAttribute(
      "href",
      /^https:\/\/wa\.me\/905359285805\?text=/
    );
  });

  test("bottom CTA links to WhatsApp and the request-lookbook action", async ({ page }) => {
    await page.goto("/en/categories");

    const inquireLink = page.getByRole("link", { name: "Inquire on WhatsApp" });
    await expect(inquireLink).toHaveAttribute("href", /^https:\/\/wa\.me\/905359285805\?text=/);

    await page.getByRole("link", { name: "Request Digital Lookbook" }).click();
    await expect(page).toHaveURL("/en/contact");
  });
});

test.describe("Category detail page", () => {
  test("shows the collection's breadcrumb, description, and pieces", async ({ page }) => {
    await page.goto("/en/categories/dining-river-tables");

    const breadcrumb = page.locator("nav.text-xs");
    await expect(breadcrumb.getByRole("link", { name: "Home", exact: true })).toBeVisible();
    await expect(breadcrumb.getByRole("link", { name: "Categories", exact: true })).toBeVisible();

    await expect(
      page.getByRole("heading", { name: "River Dining Tables & Centerpieces" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pieces in this Collection" })).toBeVisible();

    // Piece cards link into the product detail route (structural check only —
    // these are curated showcase slugs, not necessarily live catalog items).
    const pieceLinks = page.locator('a[href^="/en/products/"]');
    expect(await pieceLinks.count()).toBeGreaterThan(0);
  });

  test("breadcrumb Categories link returns to the categories index", async ({ page }) => {
    await page.goto("/en/categories/dining-river-tables");
    await page.locator("nav.text-xs").getByRole("link", { name: "Categories", exact: true }).click();
    await expect(page).toHaveURL("/en/categories");
  });

  test("visiting an unknown collection slug shows a not-found page", async ({ page }) => {
    const response = await page.goto("/en/categories/this-collection-does-not-exist");
    expect(response?.status()).toBe(404);
  });
});
