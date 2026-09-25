import { expect, test } from "@playwright/test";

test.describe("About page", () => {
  test("shows the studio intro and value pillars", async ({ page }) => {
    await page.goto("/en/about");

    await expect(page.getByRole("heading", { name: "About the Studio" })).toBeVisible();
    // "Atelier Notice" also appears in the footer on every page, so scope to <main>.
    await expect(page.locator("main").getByText("Atelier Notice", { exact: true })).toBeVisible();
    await expect(
      page.getByText(/Galassia Epoxy Design is a private atelier of master craftsmen/)
    ).toBeVisible();

    await expect(page.getByRole("heading", { name: "Fallen Timber Only" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "30-Day Slow Curing" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Atelier Certificate" })).toBeVisible();
  });

  test("no leftover placeholder image next to the intro (removed by design)", async ({ page }) => {
    await page.goto("/en/about");
    // The about page's image slot was intentionally removed; the intro text
    // now spans full width with no placeholder box beside it.
    await expect(page.locator("text=Diamond Compound Polishing")).toHaveCount(0);
  });

  test("WhatsApp CTA opens a chat with the studio message", async ({ page }) => {
    await page.goto("/en/about");

    const cta = page.getByRole("link", { name: "Start WhatsApp Discussion" });
    await expect(cta).toHaveAttribute("href", /^https:\/\/wa\.me\/905359285805\?text=/);
    await expect(cta).toHaveAttribute("target", "_blank");

    const href = await cta.getAttribute("href");
    expect(decodeURIComponent(href ?? "")).toContain("learn more about the studio");
  });
});
