import { useEffect, useState } from "react";
import type { Category, LocalizedText, Product } from "../types";
import {
  createProduct,
  deleteProduct,
  listCategories,
  listProducts,
  slugify,
  SLUG_PATTERN,
} from "../lib/store";
import LocalizedTextInput from "../components/LocalizedTextInput";

const EMPTY_TEXT: LocalizedText = { ar: "", en: "", tr: "" };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState<LocalizedText>(EMPTY_TEXT);
  const [description, setDescription] = useState<LocalizedText>(EMPTY_TEXT);
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<string[]>([""]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProducts(listProducts());
    const cats = listCategories();
    setCategories(cats);
    if (cats.length > 0) setCategoryId(cats[0].id);
  }, []);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name.en));
  }, [name.en, slugTouched]);

  function resetForm() {
    setName(EMPTY_TEXT);
    setDescription(EMPTY_TEXT);
    setSlug("");
    setSlugTouched(false);
    setImages([""]);
    setError(null);
    setShowForm(false);
  }

  function updateImage(index: number, value: string) {
    setImages((prev) => prev.map((img, i) => (i === index ? value : img)));
  }

  function addImageField() {
    if (images.length < 5) setImages((prev) => [...prev, ""]);
  }

  function removeImageField(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!categories.length) {
      setError("أضف فئة واحدة على الأقل قبل إضافة منتج.");
      return;
    }
    if (!name.ar || !name.en || !name.tr) {
      setError("اسم المنتج مطلوب باللغات الثلاث.");
      return;
    }
    if (!description.ar || !description.en || !description.tr) {
      setError("وصف المنتج مطلوب باللغات الثلاث.");
      return;
    }
    if (!SLUG_PATTERN.test(slug)) {
      setError("الرابط المختصر يجب أن يتكوّن من أحرف إنجليزية صغيرة وأرقام وشرطات فقط.");
      return;
    }
    const cleanImages = images.map((img) => img.trim()).filter(Boolean);
    if (cleanImages.length < 1 || cleanImages.length > 5) {
      setError("يجب إضافة صورة واحدة على الأقل وخمس صور كحد أقصى.");
      return;
    }

    try {
      createProduct({ name, description, slug, images: cleanImages, categoryId });
      setProducts(listProducts());
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر حفظ المنتج.");
    }
  }

  function handleDelete(id: string) {
    deleteProduct(id);
    setProducts(listProducts());
  }

  function categoryName(id: string) {
    return categories.find((c) => c.id === id)?.name.ar ?? "—";
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps text-brass">إدارة الكتالوج</p>
          <h1 className="mt-1 font-display text-xl">المنتجات</h1>
        </div>
        <button type="button" onClick={() => setShowForm((v) => !v)} className="btn-primary label-caps">
          {showForm ? "إغلاق" : "+ إضافة منتج"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5 border border-border bg-surface p-6">
          <LocalizedTextInput label="اسم المنتج" value={name} onChange={setName} />
          <LocalizedTextInput label="الوصف" value={description} onChange={setDescription} multiline />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                placeholder="emerald-gold-vein-board"
              />
            </div>
            <div>
              <label className="label-caps text-graphite" htmlFor="category">
                الفئة
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="input-field mt-2"
              >
                {categories.length === 0 && <option value="">لا توجد فئات</option>}
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.ar}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <p className="label-caps text-graphite">الصور (رابط واحد على الأقل، وخمسة كحد أقصى)</p>
            <div className="mt-2 space-y-2">
              {images.map((img, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={img}
                    onChange={(e) => updateImage(index, e.target.value)}
                    className="input-field"
                    dir="ltr"
                    placeholder="https://example.com/image.jpg"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="label-caps border border-border px-3"
                    >
                      حذف
                    </button>
                  )}
                </div>
              ))}
              {images.length < 5 && (
                <button type="button" onClick={addImageField} className="label-caps text-brass">
                  + إضافة رابط صورة
                </button>
              )}
            </div>
          </div>

          {error && (
            <p className="border border-border bg-canvas px-3 py-2 text-sm text-ink">{error}</p>
          )}

          <div className="flex gap-3">
            <button type="submit" className="btn-primary label-caps">
              حفظ المنتج
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary label-caps">
              إلغاء
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 border border-border bg-surface">
        {products.length === 0 ? (
          <p className="p-8 text-center text-sm text-graphite">لا توجد منتجات بعد.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-graphite">
                <th className="label-caps px-4 py-3 text-start">الاسم بالعربية</th>
                <th className="label-caps px-4 py-3 text-start">الفئة</th>
                <th className="label-caps px-4 py-3 text-start">الرابط المختصر</th>
                <th className="label-caps px-4 py-3 text-start">الصور</th>
                <th className="label-caps px-4 py-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">{product.name.ar}</td>
                  <td className="px-4 py-3 text-graphite">{categoryName(product.categoryId)}</td>
                  <td className="px-4 py-3 text-graphite" dir="ltr">
                    {product.slug}
                  </td>
                  <td className="px-4 py-3 text-graphite">{product.images.length}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
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
