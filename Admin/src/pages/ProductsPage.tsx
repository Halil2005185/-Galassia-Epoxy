import { useEffect, useState } from "react";
import type { Category, LocalizedText, Product } from "../types";
import { addProduct, deleteProduct, getProducts, updateProduct } from "../api/products";
import { getAllCategories } from "../api/categories";
import { getApiErrorMessage } from "../api/client";
import { slugify, SLUG_PATTERN } from "../lib/slug";
import LocalizedTextInput from "../components/LocalizedTextInput";
import ImagePicker from "../components/ImagePicker";

const EMPTY_TEXT: LocalizedText = { ar: "", en: "", tr: "" };
const MAX_IMAGES = 5;

function categoryIdOf(category: Category | string) {
  return typeof category === "string" ? category : category._id;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  const [name, setName] = useState<LocalizedText>(EMPTY_TEXT);
  const [description, setDescription] = useState<LocalizedText>(EMPTY_TEXT);
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const isEditing = editingProduct !== null;

  async function loadData() {
    setLoading(true);
    setLoadError(null);
    try {
      const [productList, categoryList] = await Promise.all([
        getProducts(1, 50),
        getAllCategories(),
      ]);
      setProducts(productList.products);
      setCategories(categoryList);
      setCategoryId((current) => current || categoryList[0]?._id || "");
    } catch (err) {
      setLoadError(getApiErrorMessage(err, "تعذر تحميل المنتجات."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name.en));
  }, [name.en, slugTouched]);

  function resetForm() {
    setName(EMPTY_TEXT);
    setDescription(EMPTY_TEXT);
    setSlug("");
    setSlugTouched(false);
    setImages([]);
    setError(null);
    setShowForm(false);
    setEditingProduct(null);
  }

  function openAddForm() {
    resetForm();
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    // Mongoose subdocuments carry their own auto-generated `_id`; pick only
    // the known fields so it doesn't ride along into the update payload
    // (the backend's Joi schema rejects unknown keys like "name._id").
    setName({ ar: product.name.ar, en: product.name.en, tr: product.name.tr });
    setDescription({
      ar: product.description.ar,
      en: product.description.en,
      tr: product.description.tr,
    });
    setSlug(product.slug);
    setSlugTouched(true);
    setCategoryId(categoryIdOf(product.category));
    setImages([]);
    setError(null);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
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
    if (isEditing) {
      if (images.length > MAX_IMAGES) {
        setError("خمس صور كحد أقصى.");
        return;
      }
    } else if (images.length < 1 || images.length > MAX_IMAGES) {
      setError("يجب اختيار صورة واحدة على الأقل وخمس صور كحد أقصى.");
      return;
    }

    setSaving(true);
    try {
      if (isEditing && editingProduct) {
        await updateProduct(editingProduct._id, {
          name,
          description,
          slug,
          category: categoryId,
          ...(images.length > 0 ? { images } : {}),
        });
      } else {
        await addProduct({ name, description, slug, category: categoryId, images });
      }
      await loadData();
      resetForm();
    } catch (err) {
      setError(getApiErrorMessage(err, "تعذر حفظ المنتج."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteProduct(id);
      await loadData();
    } catch (err) {
      setLoadError(getApiErrorMessage(err, "تعذر حذف المنتج."));
    }
  }

  function categoryLabel(category: Category | string) {
    return typeof category === "string" ? category : category.name.ar;
  }

  const query = search.trim().toLowerCase();
  const filteredProducts = query
    ? products.filter((product) =>
        [product.name.ar, product.name.en, product.name.tr].some((name) =>
          name.toLowerCase().includes(query)
        )
      )
    : products;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps text-brass">إدارة الكتالوج</p>
          <h1 className="mt-1 font-display text-xl">المنتجات</h1>
        </div>
        <button
          type="button"
          onClick={() => (showForm ? resetForm() : openAddForm())}
          className="btn-primary label-caps"
        >
          {showForm ? "إغلاق" : "+ إضافة منتج"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5 border border-border bg-surface p-6">
          <p className="label-caps text-brass">
            {isEditing ? "تعديل المنتج" : "منتج جديد"}
          </p>

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
                  <option key={c._id} value={c._id}>
                    {c.name.ar}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isEditing && editingProduct && editingProduct.images.length > 0 && (
            <div>
              <p className="label-caps text-graphite">الصور الحالية</p>
              <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-5">
                {editingProduct.images.map((image) => (
                  <div key={image.key} className="aspect-square w-full overflow-hidden border border-border bg-canvas">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.url} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="label-caps text-graphite">
              {isEditing
                ? "استبدال الصور (اختياري — اترك فارغًا للإبقاء على الصور الحالية)"
                : "الصور (صورة واحدة على الأقل، وخمس كحد أقصى)"}
            </p>
            <div className="mt-2">
              <ImagePicker files={images} onChange={setImages} max={MAX_IMAGES} />
            </div>
          </div>

          {error && (
            <p className="border border-border bg-canvas px-3 py-2 text-sm text-ink">{error}</p>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary label-caps">
              {saving ? "جارٍ الحفظ…" : isEditing ? "حفظ التعديلات" : "حفظ المنتج"}
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

      {!loading && products.length > 0 && (
        <div className="mt-6 flex items-center gap-3 border border-border bg-surface px-4 py-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 text-graphite">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث بالاسم (عربي، إنجليزي، أو تركي)…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      )}

      <div className="mt-6 border border-border bg-surface">
        {loading ? (
          <p className="p-8 text-center text-sm text-graphite">جارٍ التحميل…</p>
        ) : products.length === 0 ? (
          <p className="p-8 text-center text-sm text-graphite">لا توجد منتجات بعد.</p>
        ) : filteredProducts.length === 0 ? (
          <p className="p-8 text-center text-sm text-graphite">لا توجد نتائج مطابقة لبحثك.</p>
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
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-b border-border last:border-b-0">
                  <td className="px-4 py-3">{product.name.ar}</td>
                  <td className="px-4 py-3 text-graphite">{categoryLabel(product.category)}</td>
                  <td className="px-4 py-3 text-graphite" dir="ltr">
                    {product.slug}
                  </td>
                  <td className="px-4 py-3 text-graphite">{product.images.length}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => openEditForm(product)}
                        className="label-caps text-ink hover:text-brass"
                      >
                        تعديل
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        className="label-caps text-graphite hover:text-ink"
                      >
                        حذف
                      </button>
                    </div>
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
