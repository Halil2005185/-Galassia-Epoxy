import { useEffect, useState } from "react";
import CategoriesPage from "./CategoriesPage";
import ProductsPage from "./ProductsPage";
import { getProducts } from "../api/products";
import { getAllCategories } from "../api/categories";

type View = "overview" | "products" | "categories";

const NAV_ITEMS: { key: View; label: string }[] = [
  { key: "overview", label: "نظرة عامة" },
  { key: "products", label: "المنتجات" },
  { key: "categories", label: "الفئات" },
];

const VIEW_TITLES: Record<View, string> = {
  overview: "نظرة عامة",
  products: "المنتجات",
  categories: "الفئات",
};

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [active, setActive] = useState<View>("overview");
  const [counts, setCounts] = useState({ products: 0, categories: 0 });
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCounts() {
      try {
        const [productList, categoryList] = await Promise.all([
          getProducts(1, 1),
          getAllCategories(),
        ]);
        if (cancelled) return;
        setCounts({ products: productList.total, categories: categoryList.length });
        setConnected(true);
      } catch {
        if (cancelled) return;
        setConnected(false);
      }
    }

    loadCounts();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="hidden w-64 flex-shrink-0 border-e border-border bg-surface sm:flex sm:flex-col">
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <span className="flex h-9 w-9 items-center justify-center border border-ink font-display">
            G
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base">غالاسيا</span>
            <span className="label-caps block text-graphite">لوحة التحكم</span>
          </span>
        </div>
        <nav className="flex-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActive(item.key)}
              className={`label-caps flex w-full items-center px-3 py-3 text-start transition-colors ${
                active === item.key ? "bg-ink text-surface" : "text-graphite hover:bg-canvas"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <button type="button" onClick={onLogout} className="btn-secondary label-caps w-full">
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-5 py-4 sm:px-8">
          <div>
            <p className="label-caps text-brass">أتيليه الإدارة</p>
            <h1 className="mt-1 font-display text-xl">{VIEW_TITLES[active]}</h1>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="label-caps border border-ink px-4 py-2 sm:hidden"
          >
            خروج
          </button>
        </header>

        <nav className="flex gap-1 border-b border-border bg-surface px-5 py-2 sm:hidden">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActive(item.key)}
              className={`label-caps px-3 py-2 ${
                active === item.key ? "bg-ink text-surface" : "text-graphite"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <main className="flex-1 px-5 py-8 sm:px-8">
          {active === "overview" && (
            <div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="border border-border bg-surface p-6">
                  <p className="label-caps text-graphite">المنتجات</p>
                  <p className="mt-2 font-display text-2xl">{counts.products}</p>
                </div>
                <div className="border border-border bg-surface p-6">
                  <p className="label-caps text-graphite">الفئات</p>
                  <p className="mt-2 font-display text-2xl">{counts.categories}</p>
                </div>
                <div className="border border-border bg-surface p-6">
                  <p className="label-caps text-graphite">حالة الاتصال بالخادم</p>
                  <p className="mt-2 font-display text-2xl">
                    {connected === null ? "جارٍ التحقق…" : connected ? "متصل" : "غير متصل"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {active === "products" && <ProductsPage />}
          {active === "categories" && <CategoriesPage />}
        </main>
      </div>
    </div>
  );
}
