import { expect, test } from "@playwright/test";

test.describe("Contact page", () => {
  test("shows the WhatsApp, Instagram, Facebook, and Linktree cards", async ({ page }) => {
    await page.goto("/en/contact");

    await expect(page.getByRole("heading", { name: "Contact the Atelier" })).toBeVisible();

    const main = page.locator("main");
    await expect(main.getByText("WhatsApp", { exact: true })).toBeVisible();
    await expect(main.getByText("+90 535 928 58 05")).toBeVisible();
    await expect(main.getByText("Instagram", { exact: true })).toBeVisible();
    await expect(main.getByText("@galassia_epoxydesign")).toBeVisible();
    await expect(main.getByText("Facebook", { exact: true })).toBeVisible();
    await expect(main.getByText("Linktree", { exact: true })).toBeVisible();
  });

  test("no contact form is present (removed by design)", async ({ page }) => {
    await page.goto("/en/contact");
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.getByPlaceholder(/full name/i)).toHaveCount(0);
  });

  test("WhatsApp card links to wa.me", async ({ page }) => {
    await page.goto("/en/contact");
    const cta = page.getByRole("link", { name: "Message us on WhatsApp" });
    await expect(cta).toHaveAttribute("href", /^https:\/\/wa\.me\/905359285805\?text=/);
    await expect(cta).toHaveAttribute("target", "_blank");
  });

  test("Instagram card links to the real Instagram profile", async ({ page }) => {
    await page.goto("/en/contact");
    const link = page.locator('a[href="https://www.instagram.com/galassia_epoxydesign"]');
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  test("Facebook card links to the real Facebook page", async ({ page }) => {
    await page.goto("/en/contact");
    const link = page.locator('a[href="https://www.facebook.com/profile.php?id=61556989703838"]');
    await expect(link).toHaveAttribute("target", "_blank");
  });

  test("Linktree card links to the real Linktree page", async ({ page }) => {
    await page.goto("/en/contact");
    const link = page.locator(
      'a[href="https://linktr.ee/Galassia_Epoxy_Design?utm_source=qr_code"]'
    );
    await expect(link).toHaveAttribute("target", "_blank");
  });
});
