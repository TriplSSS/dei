"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type {
  Product,
  ProductAvailabilityStatus,
  ProductCategory,
  ProductSpec,
} from "@/data/products";

type ProductsResponse =
  | { ok: true; products: Product[]; count: number; local?: boolean }
  | { ok: false; message?: string };

type CategoriesResponse =
  | { ok: true; categories: ProductCategory[]; count: number; local?: boolean }
  | { ok: false; message?: string };

type MutationResponse<T> =
  | { ok: true; message: string; product?: T; category?: T; url?: string }
  | { ok: false; message?: string };

type FormState = {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  categoryLabel: string;
  sku: string;
  brand: string;
  manufacturer: string;
  model: string;
  series: string;
  price: string;
  priceNum: string;
  oldPrice: string;
  wholesalePrice: string;
  vatRate: string;
  vatIncluded: boolean;
  availabilityStatus: "" | ProductAvailabilityStatus;
  stockQuantity: string;
  leadTime: string;
  saleUnit: string;
  minOrderQuantity: string;
  img: string;
  description: string;
  fullDescription: string;
  specsText: string;
  tagsText: string;
  seoTitle: string;
  seoDescription: string;
  naks: boolean;
  featured: boolean;
};

type CategoryFormState = {
  originalKey: string;
  key: string;
  label: string;
  description: string;
  sortOrder: string;
};

const emptyCategoryForm: CategoryFormState = {
  originalKey: "",
  key: "",
  label: "",
  description: "",
  sortOrder: "",
};

function createEmptyProduct(category = "welding"): FormState {
  return {
    slug: "",
    name: "",
    shortName: "",
    category,
    categoryLabel: "",
    sku: "",
    brand: "DEI",
    manufacturer: "",
    model: "",
    series: "",
    price: "",
    priceNum: "",
    oldPrice: "",
    wholesalePrice: "",
    vatRate: "",
    vatIncluded: true,
    availabilityStatus: "on_order",
    stockQuantity: "",
    leadTime: "",
    saleUnit: "шт.",
    minOrderQuantity: "1",
    img: "",
    description: "",
    fullDescription: "",
    specsText: "",
    tagsText: "",
    seoTitle: "",
    seoDescription: "",
    naks: false,
    featured: false,
  };
}

const AVAILABILITY_OPTIONS: Array<{ value: "" | ProductAvailabilityStatus; label: string }> = [
  { value: "", label: "Не указано" },
  { value: "in_stock", label: "В наличии" },
  { value: "on_order", label: "Под заказ" },
  { value: "preorder", label: "Предзаказ" },
  { value: "out_of_stock", label: "Нет в наличии" },
];

function specsToText(specs: ProductSpec[]) {
  return specs.map((spec) => `${spec.label}: ${spec.value}`).join("\n");
}

function parseSpecs(value: string): ProductSpec[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) return null;
      const label = line.slice(0, separatorIndex).trim();
      const specValue = line.slice(separatorIndex + 1).trim();
      return label && specValue ? { label, value: specValue } : null;
    })
    .filter((spec): spec is ProductSpec => spec !== null);
}

function numberToFormValue(value: number | undefined) {
  return typeof value === "number" ? String(value) : "";
}

function optionalText(value: string) {
  return value.trim() || undefined;
}

function optionalNumber(value: string) {
  if (!value.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function productToForm(product: Product): FormState {
  return {
    slug: product.slug,
    name: product.name,
    shortName: product.shortName,
    category: product.category,
    categoryLabel: product.categoryLabel,
    sku: product.sku || "",
    brand: product.brand || "",
    manufacturer: product.manufacturer || "",
    model: product.model || "",
    series: product.series || "",
    price: product.price,
    priceNum: String(product.priceNum),
    oldPrice: numberToFormValue(product.oldPrice),
    wholesalePrice: numberToFormValue(product.wholesalePrice),
    vatRate: numberToFormValue(product.vatRate),
    vatIncluded: product.vatIncluded ?? true,
    availabilityStatus: product.availabilityStatus || "",
    stockQuantity: numberToFormValue(product.stockQuantity),
    leadTime: product.leadTime || "",
    saleUnit: product.saleUnit || "",
    minOrderQuantity: numberToFormValue(product.minOrderQuantity),
    img: product.img,
    description: product.description,
    fullDescription: product.fullDescription,
    specsText: specsToText(product.specs),
    tagsText: product.tags.join(", "),
    seoTitle: product.seoTitle || "",
    seoDescription: product.seoDescription || "",
    naks: Boolean(product.naks),
    featured: Boolean(product.featured),
  };
}

function formToProduct(form: FormState, categories: ProductCategory[]): Product {
  const category = categories.find((item) => item.key === form.category);
  const product: Product = {
    slug: form.slug.trim().toLowerCase(),
    name: form.name.trim(),
    shortName: form.shortName.trim(),
    category: form.category,
    categoryLabel: category?.label || form.categoryLabel.trim(),
    price: form.price.trim(),
    priceNum: Number(form.priceNum),
    img: form.img.trim(),
    description: form.description.trim(),
    fullDescription: form.fullDescription.trim(),
    specs: parseSpecs(form.specsText),
    tags: form.tagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
    naks: form.naks,
    featured: form.featured,
  };

  const optionalFields: Partial<Product> = {
    sku: optionalText(form.sku),
    brand: optionalText(form.brand),
    manufacturer: optionalText(form.manufacturer),
    model: optionalText(form.model),
    series: optionalText(form.series),
    oldPrice: optionalNumber(form.oldPrice),
    wholesalePrice: optionalNumber(form.wholesalePrice),
    vatRate: optionalNumber(form.vatRate),
    vatIncluded: form.vatRate.trim() ? form.vatIncluded : undefined,
    availabilityStatus: form.availabilityStatus || undefined,
    stockQuantity: optionalNumber(form.stockQuantity),
    leadTime: optionalText(form.leadTime),
    saleUnit: optionalText(form.saleUnit),
    minOrderQuantity: optionalNumber(form.minOrderQuantity),
    seoTitle: optionalText(form.seoTitle),
    seoDescription: optionalText(form.seoDescription),
  };

  Object.entries(optionalFields).forEach(([key, value]) => {
    if (value !== undefined) product[key as keyof Product] = value as never;
  });

  return product;
}

function categoryToForm(category: ProductCategory): CategoryFormState {
  return {
    originalKey: category.key,
    key: category.key,
    label: category.label,
    description: category.description || "",
    sortOrder: numberToFormValue(category.sortOrder),
  };
}

export default function AdminProductsClient() {
  const [token, setToken] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [localMode, setLocalMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");
  const [form, setForm] = useState<FormState>(() => createEmptyProduct());
  const [categoryForm, setCategoryForm] = useState<CategoryFormState>(emptyCategoryForm);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return products;
    return products.filter((product) =>
      [product.slug, product.name, product.shortName, product.categoryLabel]
        .some((value) => value.toLowerCase().includes(normalizedQuery))
    );
  }, [products, query]);

  const selectedCategoryUsage = products.filter((product) => product.category === categoryForm.key).length;
  const authHeaders: Record<string, string> = token.trim() ? { "x-admin-token": token.trim() } : {};

  const setField = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = event.target instanceof HTMLInputElement && event.target.type === "checkbox"
      ? event.target.checked
      : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const loadCatalog = async (event?: React.FormEvent<HTMLFormElement>, preserveFeedback = false) => {
    event?.preventDefault();
    setLoading(true);
    if (!preserveFeedback) {
      setError("");
      setMessage("");
    }

    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/admin/products", { headers: authHeaders }),
        fetch("/api/admin/categories", { headers: authHeaders }),
      ]);
      const productsData = (await productsResponse.json().catch(() => null)) as ProductsResponse | null;
      const categoriesData = (await categoriesResponse.json().catch(() => null)) as CategoriesResponse | null;

      if (!productsData || !categoriesData) throw new Error("Не удалось прочитать каталог.");
      if (!productsData.ok) throw new Error(productsData.message || "Доступ к товарам отклонен.");
      if (!categoriesData.ok) throw new Error(categoriesData.message || "Доступ к категориям отклонен.");
      if (!productsResponse.ok || !categoriesResponse.ok) throw new Error("Доступ к каталогу отклонен.");

      setProducts(productsData.products);
      setCategories(categoriesData.categories);
      setLocalMode(Boolean(productsData.local || categoriesData.local));
      setLoaded(true);
      setForm((current) => {
        if (categoriesData.categories.some((category) => category.key === current.category)) return current;
        return { ...current, category: categoriesData.categories[0]?.key || "" };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось прочитать каталог.");
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(formToProduct(form, categories)),
      });
      const data = (await response.json().catch(() => null)) as MutationResponse<Product> | null;
      if (!data) throw new Error("Не удалось сохранить товар.");
      if (!data.ok) throw new Error(data.message || "Товар не сохранен.");
      if (!response.ok) throw new Error("Товар не сохранен.");

      setMessage(data.message);
      await loadCatalog(undefined, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить товар.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCurrentProduct = async () => {
    if (!form.slug.trim() || !window.confirm(`Скрыть товар «${form.name || form.slug}» из каталога?`)) return;
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/products?slug=${encodeURIComponent(form.slug.trim())}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = (await response.json().catch(() => null)) as MutationResponse<Product> | null;
      if (!data) throw new Error("Не удалось скрыть товар.");
      if (!data.ok) throw new Error(data.message || "Товар не скрыт.");
      if (!response.ok) throw new Error("Товар не скрыт.");

      setMessage(data.message);
      setForm(createEmptyProduct(categories[0]?.key));
      await loadCatalog(undefined, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось скрыть товар.");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const body = new FormData();
      body.append("image", file);
      const response = await fetch("/api/admin/products/image", { method: "POST", headers: authHeaders, body });
      const data = (await response.json().catch(() => null)) as MutationResponse<never> | null;
      if (!data) throw new Error("Не удалось загрузить изображение.");
      if (!data.ok) throw new Error(data.message || "Изображение не загружено.");
      if (!response.ok || !data.url) throw new Error("Изображение не загружено.");

      setForm((current) => ({ ...current, img: data.url || current.img }));
      setMessage(data.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить изображение.");
    } finally {
      setUploading(false);
    }
  };

  const saveCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload: ProductCategory = {
        key: categoryForm.key.trim().toLowerCase(),
        label: categoryForm.label.trim(),
        ...(optionalText(categoryForm.description) ? { description: optionalText(categoryForm.description) } : {}),
        ...(optionalNumber(categoryForm.sortOrder) !== undefined ? { sortOrder: optionalNumber(categoryForm.sortOrder) } : {}),
      };
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders },
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => null)) as MutationResponse<ProductCategory> | null;
      if (!data) throw new Error("Не удалось сохранить категорию.");
      if (!data.ok) throw new Error(data.message || "Категория не сохранена.");
      if (!response.ok) throw new Error("Категория не сохранена.");

      setMessage(data.message);
      setCategoryForm({ ...categoryForm, originalKey: payload.key, key: payload.key });
      await loadCatalog(undefined, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить категорию.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async () => {
    if (!categoryForm.key || !window.confirm(`Удалить категорию «${categoryForm.label || categoryForm.key}»?`)) return;
    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/categories?key=${encodeURIComponent(categoryForm.key)}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = (await response.json().catch(() => null)) as MutationResponse<ProductCategory> | null;
      if (!data) throw new Error("Не удалось удалить категорию.");
      if (!data.ok) throw new Error(data.message || "Категория не удалена.");
      if (!response.ok) throw new Error("Категория не удалена.");

      setMessage(data.message);
      setCategoryForm(emptyCategoryForm);
      await loadCatalog(undefined, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить категорию.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dei-admin-page admin-products-page px-4 pb-24 sm:px-6">
      <div className="admin-products-shell mx-auto max-w-[1280px]">
        <header className="admin-dashboard-header">
          <div>
            <p className="admin-v10__index">DEI / CONTENT CONTROL</p>
            <h1>Каталог и категории</h1>
            <p>Товары, фотографии, цены, описания и структура каталога редактируются в одном месте.</p>
          </div>
          <form onSubmit={loadCatalog} className="admin-v10__auth">
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Пароль (локально не нужен)"
              autoComplete="current-password"
              aria-label="Пароль администратора"
            />
            <button type="submit" disabled={loading}>{loading ? "Загрузка…" : loaded ? "Обновить" : "Открыть админку"}</button>
          </form>
        </header>

        {loaded && (
          <div className="admin-overview">
            <div><span>Товары</span><strong>{products.length}</strong></div>
            <div><span>Категории</span><strong>{categories.length}</strong></div>
            <div><span>Хранилище</span><strong>{localMode ? "Локально" : "Сервер"}</strong></div>
          </div>
        )}

        {error && <div className="admin-feedback is-error" role="alert">{error}</div>}
        {message && <div className="admin-feedback is-success" role="status">{message}</div>}

        {loaded && (
          <>
            <nav className="admin-tabs" aria-label="Разделы каталога">
              <button type="button" aria-pressed={activeTab === "products"} className={activeTab === "products" ? "is-active" : ""} onClick={() => setActiveTab("products")}>Товары <span>{products.length}</span></button>
              <button type="button" aria-pressed={activeTab === "categories"} className={activeTab === "categories" ? "is-active" : ""} onClick={() => setActiveTab("categories")}>Категории <span>{categories.length}</span></button>
            </nav>

            {activeTab === "products" ? (
              <div className="admin-workbench grid gap-6 lg:grid-cols-[minmax(0,1fr)_480px]">
                <section className="admin-list-column min-w-0">
                  <div className="admin-search-panel">
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по товару или категории" aria-label="Поиск товаров" />
                    <button type="button" onClick={() => setForm(createEmptyProduct(categories[0]?.key))}>+ Новый товар</button>
                  </div>

                  <div className="admin-product-list">
                    {filteredProducts.length === 0 && <div className="admin-empty">Товары не найдены.</div>}
                    {filteredProducts.map((product) => (
                      <button
                        key={product.slug}
                        type="button"
                        onClick={() => setForm(productToForm(product))}
                        className={`admin-product-row${form.slug === product.slug ? " is-active" : ""}`}
                      >
                        <div className="admin-product-thumb">
                          <Image src={product.img} alt="" fill sizes="76px" className="object-contain" />
                        </div>
                        <div className="admin-product-row__copy">
                          <span>{product.categoryLabel}</span>
                          <strong>{product.name}</strong>
                          <small>{product.slug}</small>
                        </div>
                        <div className="admin-product-row__price"><strong>{product.price}</strong><span>Редактировать ↗</span></div>
                      </button>
                    ))}
                  </div>
                </section>

                <aside className="admin-editor">
                  <div className="admin-editor__head"><div><span>{form.slug ? "Редактирование" : "Новый товар"}</span><h2>Карточка товара</h2></div><button type="button" onClick={() => setForm(createEmptyProduct(categories[0]?.key))}>Очистить</button></div>

                  <form onSubmit={saveCurrentProduct} className="admin-editor__form">
                    <div className="admin-image-editor">
                      <div className="admin-image-editor__preview">
                        {form.img.startsWith("/") ? <Image src={form.img} alt={form.name || "Фото товара"} fill sizes="420px" className="object-contain" /> : <span>{form.img ? "Для предпросмотра загрузите файл в админке" : "Фото товара"}</span>}
                      </div>
                      <div className="admin-image-editor__actions">
                        <label className="admin-upload-button">
                          {uploading ? "Загрузка…" : "Загрузить фото"}
                          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} disabled={uploading} />
                        </label>
                        <small>JPG, PNG или WEBP до 8 МБ</small>
                      </div>
                    </div>

                    <FormSection title="Основное">
                      <Field label="Slug" value={form.slug} onChange={setField("slug")} placeholder="product-name" required />
                      <Field label="Название" value={form.name} onChange={setField("name")} required />
                      <div className="admin-field-grid"><Field label="Короткое имя" value={form.shortName} onChange={setField("shortName")} required /><Field label="Артикул / SKU" value={form.sku} onChange={setField("sku")} /></div>
                      <label className="admin-field"><span>Категория</span><select value={form.category} onChange={setField("category")} required>{categories.map((category) => <option key={category.key} value={category.key}>{category.label}</option>)}</select></label>
                    </FormSection>

                    <FormSection title="Цена и наличие">
                      <div className="admin-field-grid"><Field label="Цена на сайте" value={form.price} onChange={setField("price")} placeholder="от 18 500 ₽" required /><Field label="Цена числом" value={form.priceNum} onChange={setField("priceNum")} type="number" required /></div>
                      <div className="admin-field-grid"><Field label="Старая цена" value={form.oldPrice} onChange={setField("oldPrice")} type="number" /><Field label="Оптовая цена" value={form.wholesalePrice} onChange={setField("wholesalePrice")} type="number" /></div>
                      <label className="admin-field"><span>Статус наличия</span><select value={form.availabilityStatus} onChange={setField("availabilityStatus")}>{AVAILABILITY_OPTIONS.map((option) => <option key={option.value || "empty"} value={option.value}>{option.label}</option>)}</select></label>
                      <div className="admin-field-grid"><Field label="Остаток" value={form.stockQuantity} onChange={setField("stockQuantity")} type="number" /><Field label="Срок поставки" value={form.leadTime} onChange={setField("leadTime")} placeholder="2–5 дней" /></div>
                    </FormSection>

                    <FormSection title="Фото и описание">
                      <Field label="Путь к изображению" value={form.img} onChange={setField("img")} placeholder="/uploads/products/photo.webp" required />
                      <TextArea label="Краткое описание" value={form.description} onChange={setField("description")} rows={3} required />
                      <TextArea label="Полное описание" value={form.fullDescription} onChange={setField("fullDescription")} rows={5} required />
                      <TextArea label="Характеристики" value={form.specsText} onChange={setField("specsText")} rows={5} hint="Одна строка: Метка: значение" />
                      <TextArea label="Теги" value={form.tagsText} onChange={setField("tagsText")} rows={2} hint="Через запятую" />
                    </FormSection>

                    <FormSection title="Дополнительно">
                      <div className="admin-field-grid"><Field label="Бренд" value={form.brand} onChange={setField("brand")} /><Field label="Производитель" value={form.manufacturer} onChange={setField("manufacturer")} /></div>
                      <div className="admin-field-grid"><Field label="Модель" value={form.model} onChange={setField("model")} /><Field label="Серия" value={form.series} onChange={setField("series")} /></div>
                      <div className="admin-field-grid"><Field label="НДС, %" value={form.vatRate} onChange={setField("vatRate")} type="number" /><Field label="Минимальный заказ" value={form.minOrderQuantity} onChange={setField("minOrderQuantity")} type="number" /></div>
                      <div className="admin-field-grid"><Field label="Единица продажи" value={form.saleUnit} onChange={setField("saleUnit")} /><Checkbox label="Цена с НДС" checked={form.vatIncluded} onChange={setField("vatIncluded")} /></div>
                      <div className="admin-field-grid"><Checkbox label="НАКС" checked={form.naks} onChange={setField("naks")} /><Checkbox label="Рекомендуемый" checked={form.featured} onChange={setField("featured")} /></div>
                    </FormSection>

                    <FormSection title="SEO">
                      <Field label="SEO title" value={form.seoTitle} onChange={setField("seoTitle")} />
                      <TextArea label="SEO description" value={form.seoDescription} onChange={setField("seoDescription")} rows={3} />
                    </FormSection>

                    <div className="admin-editor__footer"><button type="submit" disabled={saving || uploading}>{saving ? "Сохранение…" : "Сохранить товар"}</button><button type="button" disabled={!form.slug || saving} onClick={deleteCurrentProduct}>Скрыть</button></div>
                  </form>
                </aside>
              </div>
            ) : (
              <div className="admin-category-layout">
                <section className="admin-category-list">
                  <div className="admin-section-head"><div><span>Структура каталога</span><h2>Категории товаров</h2></div><button type="button" onClick={() => setCategoryForm(emptyCategoryForm)}>+ Новая категория</button></div>
                  <div className="admin-category-grid">
                    {categories.map((category, index) => {
                      const count = products.filter((product) => product.category === category.key).length;
                      return <button key={category.key} type="button" aria-pressed={categoryForm.key === category.key} className={categoryForm.key === category.key ? "is-active" : ""} onClick={() => setCategoryForm(categoryToForm(category))}><span>{String(index + 1).padStart(2, "0")}</span><strong>{category.label}</strong><p>{category.description || "Описание категории пока не заполнено."}</p><small>{count} товар(а/ов)</small></button>;
                    })}
                  </div>
                </section>

                <aside className="admin-category-editor">
                  <div className="admin-editor__head"><div><span>{categoryForm.originalKey ? "Редактирование" : "Новая категория"}</span><h2>Категория</h2></div><button type="button" onClick={() => setCategoryForm(emptyCategoryForm)}>Очистить</button></div>
                  <form onSubmit={saveCategory} className="admin-editor__form">
                    <Field label="Ключ латиницей" value={categoryForm.key} onChange={(event) => setCategoryForm((current) => ({ ...current, key: event.target.value }))} placeholder="welding-machines" required disabled={Boolean(categoryForm.originalKey)} />
                    <Field label="Название" value={categoryForm.label} onChange={(event) => setCategoryForm((current) => ({ ...current, label: event.target.value }))} required />
                    <TextArea label="Описание" value={categoryForm.description} onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))} rows={4} />
                    <Field label="Порядок сортировки" value={categoryForm.sortOrder} onChange={(event) => setCategoryForm((current) => ({ ...current, sortOrder: event.target.value }))} type="number" placeholder="10" />
                    {categoryForm.originalKey && <div className="admin-category-usage"><span>Используется в товарах</span><strong>{selectedCategoryUsage}</strong></div>}
                    <div className="admin-editor__footer"><button type="submit" disabled={saving}>{saving ? "Сохранение…" : "Сохранить категорию"}</button><button type="button" disabled={!categoryForm.originalKey || saving || selectedCategoryUsage > 0} onClick={deleteCategory}>Удалить</button></div>
                  </form>
                </aside>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required = false, disabled = false }: { label: string; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string; required?: boolean; disabled?: boolean }) {
  return <label className="admin-field"><span>{label}</span><input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled} /></label>;
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="admin-form-section"><h3>{title}</h3>{children}</section>;
}

function TextArea({ label, value, onChange, rows, hint, required = false }: { label: string; value: string; onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void; rows: number; hint?: string; required?: boolean }) {
  return <label className="admin-field"><span>{label}</span><textarea value={value} onChange={onChange} rows={rows} required={required} />{hint && <small>{hint}</small>}</label>;
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) {
  return <label className="admin-checkbox"><input type="checkbox" checked={checked} onChange={onChange} /><span>{label}</span></label>;
}
