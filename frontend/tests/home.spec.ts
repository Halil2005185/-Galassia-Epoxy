import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test("loads with hero content and navigates to the catalog", async ({ page }) => {
    await page.goto("/en");

    await expect(
      page.getByRole("heading", { name: "Where Liquid Art Meets Enduring Craftsmanship" })
    ).toBeVisible();
    await expect(page.getByText(/Handcrafted epoxy resin and exotic hardwood masterpieces/)).toBeVisible();

    await expect(page.getByRole("link", { name: "Explore Catalog" })).toBeVisible();
    await page.getByRole("link", { name: "Explore Catalog" }).click();

    await expect(page).toHaveURL("/en/products");
  });

  test("shows the hero stats", async ({ page }) => {
    await page.goto("/en");

    await expect(page.getByText("Handmade", { exact: true })).toBeVisible();
    await expect(page.getByText("Eco Resins", { exact: true })).toBeVisible();
    await expect(page.getByText("Unique Veins", { exact: true })).toBeVisible();
  });

  test("hero WhatsApp inquire button opens a wa.me link", async ({ page }) => {
    await page.goto("/en");

    const whatsappLink = page.getByRole("link", { name: "Inquire on WhatsApp" });
    await expect(whatsappLink).toBeVisible();
    await expect(whatsappLink).toHaveAttribute("href", /^https:\/\/wa\.me\/905359285805\?text=/);
    await expect(whatsappLink).toHaveAttribute("target", "_blank");
  });

  test("shows Masterwork Creations cards sourced from the backend", async ({ page }) => {
    await page.goto("/en");

    await expect(page.getByRole("heading", { name: "Masterwork Creations" })).toBeVisible();

    const cards = page.locator("section", { hasText: "Masterwork Creations" }).getByRole("link", {
      name: "View Details",
    });
    await expect(cards.first()).toBeVisible();

    // Each card's WhatsApp Inquire button should deep-link to that product's page.
    const whatsappButtons = page
      .locator("section", { hasText: "Masterwork Creations" })
      .getByRole("link", { name: "WhatsApp Inquire" });
    const count = await whatsappButtons.count();
    expect(count).toBeGreaterThan(0);
    const href = await whatsappButtons.first().getAttribute("href");
    expect(href).toContain("wa.me/905359285805");
    expect(decodeURIComponent(href ?? "")).toContain("/en/products/");
  });

  test("shows the philosophy section and its three steps", async ({ page }) => {
    await page.goto("/en");

    await expect(
      page.getByRole("heading", { name: "The Alchemy of Ancient Wood & Crystal Resin" })
    ).toBeVisible();
    await expect(page.getByText("Zero-VOC Museum Grade Resins")).toBeVisible();
    await expect(page.getByText("Bespoke Custom Pigments & Gold Foils")).toBeVisible();
    await expect(page.getByText("Direct WhatsApp Artisan Consultation")).toBeVisible();
  });

  test("bottom CTA links to WhatsApp and the contact page", async ({ page }) => {
    await page.goto("/en");

    const startDiscussion = page.getByRole("link", { name: "Start WhatsApp Discussion" });
    await expect(startDiscussion).toHaveAttribute("href", /^https:\/\/wa\.me\/905359285805\?text=/);

    await page.getByRole("link", { name: "Request Atelier Brief" }).click();
    await expect(page).toHaveURL("/en/contact");
  });

  test("does not render a placeholder image (removed by design)", async ({ page }) => {
    await page.goto("/en");

    // The "Curated Collections" placeholder grid and the philosophy placeholder
    // image were intentionally removed from the home page.
    await expect(page.getByText("Curated Collections")).toHaveCount(0);
  });
});
