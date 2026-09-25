import { expect, test } from "@playwright/test";

test.describe("robots.txt and sitemap.xml", () => {
  test("robots.txt allows crawling and points at the sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("User-Agent: *");
    expect(body).toContain("Allow: /");
    expect(body).toContain("Sitemap: http://localhost:3000/sitemap.xml");
  });

  test("sitemap.xml is valid XML with all locales and real product slugs", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");

    const body = await response.text();
    expect(body).toContain("<urlset");
    expect(body).toContain("<loc>http://localhost:3000/tr</loc>");
    expect(body).toContain("<loc>http://localhost:3000/en</loc>");
    expect(body).toContain("<loc>http://localhost:3000/ar</loc>");
    expect(body).toContain("<loc>http://localhost:3000/en/products</loc>");
    expect(body).toContain("<loc>http://localhost:3000/en/categories/dining-river-tables</loc>");
    // Real product slug pulled live from the backend, not a static/mock one.
    expect(body).toContain("/products/noor-golden-calligraphy-resin-art</loc>");
    // hreflang alternates for language variants.
    expect(body).toContain('hreflang="tr"');
    expect(body).toContain('hreflang="en"');
    expect(body).toContain('hreflang="ar"');
  });
});

test.describe("Canonical and hreflang tags", () => {
  test("static page has a self-referencing canonical and all-locale hreflang links", async ({ page }) => {
    await page.goto("/en/about");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "http://localhost:3000/en/about"
    );
    await expect(page.locator('link[rel="alternate"][hreflang="tr"]')).toHaveAttribute(
      "href",
      "http://localhost:3000/tr/about"
    );
    await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute(
      "href",
      "http://localhost:3000/ar/about"
    );
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      "href",
      "http://localhost:3000/tr/about"
    );
  });

  test("product detail page canonical matches its own slug and locale", async ({ page }) => {
    await page.goto("/ar/products/noor-golden-calligraphy-resin-art");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "http://localhost:3000/ar/products/noor-golden-calligraphy-resin-art"
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      "http://localhost:3000/en/products/noor-golden-calligraphy-resin-art"
    );
  });
});

test.describe("Per-page metadata uniqueness", () => {
  test("About, Products, and Contact pages each have distinct titles and descriptions", async ({ page }) => {
    const seen = new Map<string, string>();

    for (const path of ["/en/about", "/en/products", "/en/contact"]) {
      await page.goto(path);
      const title = await page.title();
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description, `${path} should have a description`).toBeTruthy();

      for (const [seenPath, seenDescription] of seen) {
        expect(description, `${path} description should differ from ${seenPath}`).not.toBe(seenDescription);
      }
      seen.set(path, description ?? "");
      expect(title).toContain("Galassia Epoxy Design");
    }
  });
});

test.describe("Open Graph and Twitter metadata", () => {
  test("product page uses the real product photo as its OG/Twitter image", async ({ page }) => {
    await page.goto("/en/products/noor-golden-calligraphy-resin-art");

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(ogImage).toContain("r2.dev/products/");

    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute("content");
    expect(twitterCard).toBe("summary_large_image");

    const ogSiteName = await page.locator('meta[property="og:site_name"]').getAttribute("content");
    expect(ogSiteName).toBe("Galassia Epoxy Design");
  });

  test("static pages fall back to the generated branded OG image", async ({ page }) => {
    await page.goto("/en/about");
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(ogImage).toContain("/en/opengraph-image");
  });

  test("the generated OG image endpoint responds for all three locales", async ({ request }) => {
    for (const locale of ["tr", "en", "ar"]) {
      const response = await request.get(`/${locale}/opengraph-image`);
      expect(response.status(), `${locale} OG image should render`).toBe(200);
      expect(response.headers()["content-type"]).toContain("image");
    }
  });
});

test.describe("Structured data (JSON-LD)", () => {
  test("every page includes Organization JSON-LD", async ({ page }) => {
    await page.goto("/en");
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = scripts.map((s) => JSON.parse(s)["@type"]);
    expect(types).toContain("Organization");
  });

  test("product page includes Product and BreadcrumbList JSON-LD matching real data", async ({ page }) => {
    await page.goto("/en/products/noor-golden-calligraphy-resin-art");
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const parsed = scripts.map((s) => JSON.parse(s));

    const product = parsed.find((p) => p["@type"] === "Product");
    expect(product).toBeTruthy();
    expect(product.name).toBe("Noor – Golden Calligraphy Resin Art");
    expect(product.image.length).toBeGreaterThan(0);

    const breadcrumb = parsed.find((p) => p["@type"] === "BreadcrumbList");
    expect(breadcrumb).toBeTruthy();
    expect(breadcrumb.itemListElement).toHaveLength(3);
    expect(breadcrumb.itemListElement[2].name).toBe("Noor – Golden Calligraphy Resin Art");
  });

  test("category detail page includes BreadcrumbList JSON-LD", async ({ page }) => {
    await page.goto("/en/categories/dining-river-tables");
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = scripts.map((s) => JSON.parse(s)["@type"]);
    expect(types).toContain("BreadcrumbList");
  });
});

test.describe("404 page SEO behavior", () => {
  test("an explicit not-found (unknown product slug) returns 404, noindex, and localized copy", async ({ page }) => {
    for (const [locale, expectedH1] of [
      ["tr", "Sayfa Bulunamadı"],
      ["en", "Page Not Found"],
      ["ar", "الصفحة غير موجودة"],
    ] as const) {
      const response = await page.goto(`/${locale}/products/this-slug-does-not-exist-xyz`);
      expect(response?.status()).toBe(404);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.getByRole("heading", { name: expectedH1 })).toBeVisible();
      const robots = await page.locator('meta[name="robots"]').first().getAttribute("content");
      expect(robots).toContain("noindex");
    }
  });

  test("a completely unmatched URL still returns a branded 404 (not a bare error page)", async ({ page }) => {
    const response = await page.goto("/this-path-was-never-defined-anywhere");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page Not Found" })).toBeVisible();
    const robots = await page.locator('meta[name="robots"]').first().getAttribute("content");
    expect(robots).toContain("noindex");
  });
});
