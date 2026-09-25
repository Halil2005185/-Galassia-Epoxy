import { expect, test } from "@playwright/test";

test.describe("Header navigation", () => {
  test("desktop nav links go to the right pages", async ({ page }) => {
    await page.goto("/en");

    const nav = page.locator("nav").filter({ hasText: "Products" }).first();

    await nav.getByRole("link", { name: "Products", exact: true }).click();
    await expect(page).toHaveURL("/en/products");

    await nav.getByRole("link", { name: "Categories", exact: true }).click();
    await expect(page).toHaveURL("/en/categories");

    await nav.getByRole("link", { name: "About Studio", exact: true }).click();
    await expect(page).toHaveURL("/en/about");

    await nav.getByRole("link", { name: "Contact", exact: true }).click();
    await expect(page).toHaveURL("/en/contact");

    await nav.getByRole("link", { name: "Home", exact: true }).click();
    await expect(page).toHaveURL("/en");
  });

  test("logo links back to the home page", async ({ page }) => {
    await page.goto("/en/about");
    await page.getByRole("link", { name: "Galassia Epoxy Design" }).click();
    await expect(page).toHaveURL("/en");
  });

  test("header WhatsApp button opens a wa.me link", async ({ page }) => {
    await page.goto("/en");

    const headerWhatsapp = page.locator("header").getByRole("link", { name: "Chat on WhatsApp" });
    await expect(headerWhatsapp).toHaveAttribute("href", /^https:\/\/wa\.me\/905359285805\?text=/);
    await expect(headerWhatsapp).toHaveAttribute("target", "_blank");
  });

  test("announcement banner is visible", async ({ page }) => {
    await page.goto("/en");
    await expect(
      page.getByText("Artisanal Handmade Pieces • Bespoke Commissions Available • Inquire via WhatsApp")
    ).toBeVisible();
  });
});

test.describe("Footer", () => {
  test("shows brand info and links to the right pages", async ({ page }) => {
    await page.goto("/en");
    const footer = page.locator("footer");

    await expect(footer.getByText("Galassia Epoxy Design", { exact: true })).toBeVisible();
    await expect(footer.getByText("© 2024 Galassia Epoxy Design Atelier. All rights reserved.")).toBeVisible();

    await footer.getByRole("link", { name: "All Products" }).click();
    await expect(page).toHaveURL("/en/products");
  });

  test("About Studio footer link navigates to the about page", async ({ page }) => {
    await page.goto("/en");
    await page.locator("footer").getByRole("link", { name: "About Studio" }).click();
    await expect(page).toHaveURL("/en/about");
  });
});
