import { expect, test } from "@playwright/test";

test.describe("Products listing page", () => {
  test("loads the catalog with product cards from the backend", async ({ page }) => {
    await page.goto("/en/products");

    await expect(page.getByRole("heading", { name: "The Atelier Catalog" })).toBeVisible();
    await expect(page.getByText("Permanent Curation")).toBeVisible();

    const viewPieceLinks = page.getByRole("link", { name: "View Piece" });
    await expect(viewPieceLinks.first()).toBeVisible();
    expect(await viewPieceLinks.count()).toBeGreaterThan(0);
  });

  test("search bar filters products by name in real time", async ({ page }) => {
    await page.goto("/en/products");

    const cards = page.getByRole("link", { name: "View Piece" });
    const totalCount = await cards.count();
    expect(totalCount).toBeGreaterThan(0);

    const search = page.getByPlaceholder("Search by material, pigment, or style…");
    await search.fill("Noor");
    await expect(cards).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Noor" })).toBeVisible();

    // A query that matches nothing shows the "no results" message.
    await search.fill("zzzz-no-such-product-zzzz");
    await expect(page.getByText("No pieces match your search or category filter.")).toBeVisible();
    await expect(cards).toHaveCount(0);

    // Clearing the search restores the full catalog.
    await search.fill("");
    await expect(cards).toHaveCount(totalCount);
  });

  test("category tabs filter the grid and 'All Collections' resets it", async ({ page }) => {
    await page.goto("/en/products");

    const cards = page.getByRole("link", { name: "View Piece" });
    const totalCount = await cards.count();

    const allCollectionsButton = page.getByRole("button", { name: /All Collections/ });
    await expect(allCollectionsButton).toBeVisible();

    // Pick the first category tab that isn't "All Collections" and confirm
    // it narrows the grid to a smaller (but non-zero) set of products.
    const categoryButtons = page.locator("button.label-caps.pb-2");
    const categoryCount = await categoryButtons.count();
    expect(categoryCount).toBeGreaterThan(1); // "All Collections" + at least one category

    const firstCategoryButton = categoryButtons.nth(1);
    const categoryName = (await firstCategoryButton.textContent())?.trim();
    await firstCategoryButton.click();

    const filteredCount = await cards.count();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThanOrEqual(totalCount);

    await allCollectionsButton.click();
    await expect(cards).toHaveCount(totalCount);

    expect(categoryName).toBeTruthy();
  });

  test("product card WhatsApp button links to wa.me with the product page URL", async ({ page }) => {
    await page.goto("/en/products");

    const whatsappButtons = page.getByRole("link", { name: "WhatsApp Inquire" });
    const href = await whatsappButtons.first().getAttribute("href");
    expect(href).toContain("https://wa.me/905359285805?text=");
    expect(decodeURIComponent(href ?? "")).toContain("/en/products/");
  });

  test("clicking View Piece navigates to the product detail page", async ({ page }) => {
    await page.goto("/en/products");

    await page.getByRole("link", { name: "View Piece" }).first().click();
    await expect(page).toHaveURL(/\/en\/products\/[a-z0-9-]+/);
  });

  test("bottom commission CTA opens WhatsApp", async ({ page }) => {
    await page.goto("/en/products");
    const cta = page.getByRole("link", { name: "Initiate WhatsApp Commission" });
    await expect(cta).toHaveAttribute("href", /^https:\/\/wa\.me\/905359285805\?text=/);
  });
});

test.describe("Product detail page", () => {
  const slug = "noor-golden-calligraphy-resin-art";

  test("shows product details, breadcrumb, and image", async ({ page }) => {
    await page.goto(`/en/products/${slug}`);

    const breadcrumb = page.locator("nav.text-xs");
    await expect(breadcrumb.getByRole("link", { name: "Home", exact: true })).toBeVisible();
    await expect(breadcrumb.getByRole("link", { name: "Products", exact: true })).toBeVisible();

    await expect(page.getByRole("heading", { name: "Noor – Golden Calligraphy Resin Art" })).toBeVisible();
    await expect(page.locator('img[alt="Noor – Golden Calligraphy Resin Art"]').first()).toBeVisible();
  });

  test("WhatsApp order and custom-request buttons link to the product page", async ({ page }) => {
    await page.goto(`/en/products/${slug}`);

    const sendOrder = page.getByRole("link", { name: "Send via WhatsApp to Order / Inquire" });
    await expect(sendOrder).toHaveAttribute("href", /^https:\/\/wa\.me\/905359285805\?text=/);
    expect(decodeURIComponent((await sendOrder.getAttribute("href")) ?? "")).toContain(
      `/en/products/${slug}`
    );

    const requestCustom = page.getByRole("link", { name: "Request Custom Size or Colorway" });
    await expect(requestCustom).toHaveAttribute("href", /^https:\/\/wa\.me\/905359285805\?text=/);
  });

  test("breadcrumb Products link returns to the catalog", async ({ page }) => {
    await page.goto(`/en/products/${slug}`);
    await page.locator("nav.text-xs").getByRole("link", { name: "Products", exact: true }).click();
    await expect(page).toHaveURL("/en/products");
  });

  test("visiting an unknown product slug shows a not-found page", async ({ page }) => {
    const response = await page.goto("/en/products/this-slug-does-not-exist-anywhere");
    expect(response?.status()).toBe(404);
  });
});
