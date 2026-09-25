import { expect, test } from "@playwright/test";

test.describe("Language switching", () => {
  test("switches from English to Turkish and preserves the current path", async ({ page }) => {
    await page.goto("/en/products");

    await page.getByRole("button", { name: "Language" }).click();
    await page.getByRole("link", { name: "Türkçe" }).click();

    await expect(page).toHaveURL("/tr/products");
    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { name: "Atölye Kataloğu" })).toBeVisible();
  });

  test("Turkish hero heading renders the real Turkish copy", async ({ page }) => {
    await page.goto("/tr");
    await expect(
      page.getByRole("heading", { name: "Sıvı Sanatın Kalıcı Zanaatla Buluştuğu Yer" })
    ).toBeVisible();
  });

  test("switches from English to Arabic, preserves the path, and flips to RTL", async ({ page }) => {
    await page.goto("/en/products");

    await page.getByRole("button", { name: "Language" }).click();
    await page.getByRole("link", { name: "العربية" }).click();

    await expect(page).toHaveURL("/ar/products");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { name: "كتالوج غالاسيا" })).toBeVisible();
  });

  test("switches back to English from Arabic", async ({ page }) => {
    await page.goto("/ar/about");

    await page.getByRole("button", { name: "اللغة" }).click();
    await page.getByRole("link", { name: "English" }).click();

    await expect(page).toHaveURL("/en/about");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await expect(page.getByRole("heading", { name: "About the Studio" })).toBeVisible();
  });

  test("Arabic nav labels render in Arabic and WhatsApp opener text is localized", async ({ page }) => {
    await page.goto("/ar");

    const nav = page.locator("nav").filter({ hasText: "المنتجات" }).first();
    await expect(nav.getByRole("link", { name: "الرئيسية", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "المنتجات", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "تواصل معنا", exact: true })).toBeVisible();

    const whatsapp = page.locator("header").getByRole("link", { name: "تواصل عبر واتساب" });
    const href = await whatsapp.getAttribute("href");
    expect(decodeURIComponent(href ?? "")).toContain("مرحبًا غالاسيا");
  });
});
