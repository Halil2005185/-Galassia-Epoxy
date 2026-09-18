import { useEffect, useState } from "react";
import type { Category, LocalizedText } from "../types";
import { createCategory, deleteCategory, listCategories, slugify, SLUG_PATTERN } from "../lib/store";
import LocalizedTextInput from "../components/LocalizedTextInput";

const EMPTY_NAME: LocalizedText = { ar: "", en: "", tr: "" };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState<LocalizedText>(EMPTY_NAME);
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCategories(listCategories());
  }, []);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name.en));
  }, [name.en, slugTouched]);

  function resetForm() {
    setName(EMPTY_NAME);
    setSlug("");
    setSlugTouched(false);
    setError(null);
    setShowForm(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.ar || !name.en || !name.tr) {
      setError("الاسم مطلوب باللغات الثلاث.");
      return;
    }
    if (!SLUG_PATTERN.test(slug)) {
      setError("الرابط المختصر يجب أن يتكوّن من أحرف إنجليزية صغيرة وأرقام وشرطات فقط.");
      return;
    }
    try {
      createCategory({ name, slug });
      setCategories(listCategories());
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ الفئة.");
    }
  }

  function handleDelete(id: string) {
    deleteCategory(id);
    setCategories(listCategories());
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps text-brass">إدارة الكتالوج</p>
          <h1 className="mt-1 font-display text-xl">الفئات</h1>
        </div>
        <button type="button" onClick={() => setShowForm((v) => !v)} className="btn-primary label-caps">
          {showForm ? "إغلاق" : "+ إضافة فئة"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5 border border-border bg-surface p-6">
          <LocalizedTextInput label="اسم الفئة" value={name} onChange={setName} />

          <div>
            <label className="label-caps text-graphite" htmlFor="slug">
              الرابط المختصر (Slug)
            </label>
            <input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className="input-field mt-2"
              dir="ltr"
              placeholder="wall-art-geodes"
            />
          </div>

          {error && (
            <p className="border border-border bg-canvas px-3 py-2 text-sm text-ink">{error}</p>
          )}

          <div className="flex gap-3">
            <button type="submit" className="btn-primary label-caps">
              حفظ الفئة
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary label-caps">
              إلغاء
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 border border-border bg-surface">
        {categories.length === 0 ? (
          <p className="p-8 text-center text-sm text-graphite">لا توجد فئات بعد.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-graphite">
                <th className="label-caps px-4 py-3 text-start">الاسم بالعربية</th>
                <th className="label-caps px-4 py-3 text-start">الاسم بالإنجليزية</th>
                <th className="label-caps px-4 py-3 text-start">الرابط المختصر</th>
                <th className="label-caps px-4 py-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">{category.name.ar}</td>
                  <td className="px-4 py-3 text-graphite" dir="ltr">
                    {category.name.en}
                  </td>
                  <td className="px-4 py-3 text-graphite" dir="ltr">
                    {category.slug}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(category.id)}
                      className="label-caps text-graphite hover:text-ink"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
