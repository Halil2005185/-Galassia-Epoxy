import { useEffect, useState } from "react";
import type { Category, LocalizedText } from "../types";
import { addCategory, deleteCategory, getAllCategories } from "../api/categories";
import { getApiErrorMessage } from "../api/client";
import { slugify, SLUG_PATTERN } from "../lib/slug";
import LocalizedTextInput from "../components/LocalizedTextInput";

const EMPTY_NAME: LocalizedText = { ar: "", en: "", tr: "" };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState<LocalizedText>(EMPTY_NAME);
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function loadCategories() {
    setLoading(true);
    setLoadError(null);
    try {
      setCategories(await getAllCategories());
    } catch (err) {
      setLoadError(getApiErrorMessage(err, "تعذر تحميل الفئات."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
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

  async function handleSubmit(e: React.FormEvent) {
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

    setSaving(true);
    try {
      await addCategory({ name, slug });
      await loadCategories();
      resetForm();
    } catch (err) {
      setError(getApiErrorMessage(err, "تعذر حفظ الفئة."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteCategory(id);
      await loadCategories();
    } catch (err) {
      setLoadError(getApiErrorMessage(err, "تعذر حذف الفئة."));
    }
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
            <button type="submit" disabled={saving} className="btn-primary label-caps">
              {saving ? "جارٍ الحفظ…" : "حفظ الفئة"}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary label-caps">
              إلغاء
            </button>
          </div>
        </form>
      )}

      {loadError && (
        <p className="mt-6 border border-border bg-surface px-4 py-3 text-sm text-ink">{loadError}</p>
      )}

      <div className="mt-6 border border-border bg-surface">
        {loading ? (
          <p className="p-8 text-center text-sm text-graphite">جارٍ التحميل…</p>
        ) : categories.length === 0 ? (
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
                <tr key={category._id} className="border-b border-border last:border-b-0">
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
                      onClick={() => handleDelete(category._id)}
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
