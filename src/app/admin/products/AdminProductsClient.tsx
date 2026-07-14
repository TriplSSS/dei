"use client";

import Image from "next/image";
import Link from "next/link";
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

type AdminSection = "products" | "categories" | "orders" | "analytics" | "import";
type EditorPanel = "product" | "category" | null;
type AdminIconName = "box" | "tag" | "orders" | "analytics" | "import" | "home" | "menu" | "close" | "plus" | "refresh" | "lock" | "arrow" | "search" | "external" | "image";
type AdminSectionDefinition = {
  id: AdminSection;
  label: string;
  title: string;
  description: string;
  code: string;
  icon: AdminIconName;
  development?: boolean;
};

const ADMIN_SECTIONS: AdminSectionDefinition[] = [
  { id: "products", label: "Товары", title: "Управление товарами", description: "Редактируйте ассортимент, цены, фотографии и описания.", code: "PRODUCTS", icon: "box" },
  { id: "categories", label: "Категории", title: "Категории каталога", description: "Управляйте структурой и порядком разделов каталога.", code: "CATEGORIES", icon: "tag" },
  { id: "orders", label: "Заказы", title: "Заказы", description: "Раздел будет подключён вместе с системой заявок и оплат.", code: "ORDERS", icon: "orders", development: true },
  { id: "analytics", label: "Аналитика", title: "Аналитика", description: "Сводка по просмотрам, обращениям и товарам появится после запуска сайта.", code: "ANALYTICS", icon: "analytics", development: true },
  { id: "import", label: "Импорт", title: "Импорт данных", description: "Массовая загрузка товаров будет добавлена после наполнения основного каталога.", code: "IMPORT", icon: "import", development: true },
];

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

function availabilityLabel(status?: ProductAvailabilityStatus) {
  if (status === "in_stock") return "В наличии";
  if (status === "preorder") return "Предзаказ";
  if (status === "out_of_stock") return "Нет в наличии";
  return "Под заказ";
}

function availabilityClass(status?: ProductAvailabilityStatus) {
  if (status === "in_stock") return "is-ready";
  if (status === "out_of_stock") return "is-muted";
  return "is-order";
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
  const [activeSection, setActiveSection] = useState<AdminSection>("products");
  const [editorPanel, setEditorPanel] = useState<EditorPanel>(null);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [productDirty, setProductDirty] = useState(false);
  const [categoryDirty, setCategoryDirty] = useState(false);
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
    setProductDirty(true);
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
      setProductDirty(false);
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
      setProductDirty(false);
      setEditorPanel(null);
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
      setProductDirty(true);
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
      setCategoryDirty(false);
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
      setCategoryDirty(false);
      setEditorPanel(null);
      await loadCatalog(undefined, true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить категорию.");
    } finally {
      setSaving(false);
    }
  };

  const currentSection = ADMIN_SECTIONS.find((section) => section.id === activeSection) || ADMIN_SECTIONS[0];
  const featuredProducts = products.filter((product) => product.featured).length;
  const inStockProducts = products.filter((product) => product.availabilityStatus === "in_stock").length;
  const assignedCategories = categories.filter((category) =>
    products.some((product) => product.category === category.key)
  ).length;

  const editorHasUnsavedChanges = editorPanel === "product" ? productDirty : editorPanel === "category" ? categoryDirty : false;

  const closeEditor = () => {
    if (editorHasUnsavedChanges && !window.confirm("Закрыть редактор без сохранения изменений?")) return;
    setEditorPanel(null);
  };

  const selectSection = (section: AdminSection) => {
    if (editorHasUnsavedChanges && !window.confirm("Перейти в другой раздел без сохранения изменений?")) return;
    setActiveSection(section);
    setEditorPanel(null);
    setMobileNavigationOpen(false);
    setError("");
    setMessage("");
  };

  const createProduct = () => {
    setForm(createEmptyProduct(categories[0]?.key));
    setProductDirty(false);
    setEditorPanel("product");
  };

  const editProduct = (product: Product) => {
    setForm(productToForm(product));
    setProductDirty(false);
    setEditorPanel("product");
  };

  const createCategory = () => {
    setCategoryForm(emptyCategoryForm);
    setCategoryDirty(false);
    setEditorPanel("category");
  };

  const editCategory = (category: ProductCategory) => {
    setCategoryForm(categoryToForm(category));
    setCategoryDirty(false);
    setEditorPanel("category");
  };

  return (
    <div className="admin-console">
      <button
        type="button"
        className={`admin-console__scrim${mobileNavigationOpen ? " is-visible" : ""}`}
        onClick={() => setMobileNavigationOpen(false)}
        aria-label="Закрыть меню"
        tabIndex={mobileNavigationOpen ? 0 : -1}
      />

      <aside className={`admin-console__sidebar${mobileNavigationOpen ? " is-open" : ""}`} id="admin-navigation" inert={editorPanel ? true : undefined}>
        <div className="admin-console__brand">
          <Link href="/" aria-label="DEI — открыть сайт"><strong>DEI</strong></Link>
          <span>Панель управления</span>
        </div>

        <nav className="admin-console__nav" aria-label="Разделы панели управления">
          <p>Управление</p>
          {ADMIN_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={activeSection === section.id ? "is-active" : ""}
              aria-current={activeSection === section.id ? "page" : undefined}
              onClick={() => selectSection(section.id)}
            >
              <AdminIcon name={section.icon} />
              <span>{section.label}</span>
              {section.id === "products" && loaded && <small>{products.length}</small>}
              {section.id === "categories" && loaded && <small>{categories.length}</small>}
              {section.development && <em>Скоро</em>}
            </button>
          ))}
        </nav>

        <div className="admin-console__sidebar-footer">
          <div className={`admin-console__connection${loaded ? " is-online" : ""}`}>
            <span />
            <div>
              <strong>{loaded ? "Каталог подключён" : "Требуется доступ"}</strong>
              <small>{loaded ? (localMode ? "Локальное хранилище" : "Серверное хранилище") : "Авторизуйтесь для работы"}</small>
            </div>
          </div>
          <Link href="/" className="admin-console__site-link"><AdminIcon name="home" />Открыть сайт</Link>
          {loaded && <button type="button" className="admin-console__logout" onClick={() => { setLoaded(false); setProducts([]); setCategories([]); setEditorPanel(null); }}>Сменить доступ</button>}
        </div>
      </aside>

      <main className="admin-console__main" inert={editorPanel ? true : undefined}>
        <header className="admin-console__topbar">
          <button
            type="button"
            className="admin-console__menu-button"
            onClick={() => setMobileNavigationOpen((current) => !current)}
            aria-expanded={mobileNavigationOpen}
            aria-controls="admin-navigation"
          >
            <AdminIcon name="menu" />
            <span>Меню</span>
          </button>
          <div className="admin-console__breadcrumb"><span>DEI Control</span><b>/</b><strong>{currentSection.label}</strong></div>
          <div className="admin-console__top-status"><span className={loaded ? "is-online" : ""} />{loaded ? "Система готова" : "Закрытый контур"}</div>
        </header>

        <div className="admin-console__content">
          {error && <div className="admin-console__notice is-error" role="alert"><span>!</span>{error}</div>}
          {message && <div className="admin-console__notice is-success" role="status" aria-live="polite"><span>✓</span>{message}</div>}

          {!loaded ? (
            <section className="admin-access" aria-labelledby="admin-access-title">
              <div className="admin-access__signal" aria-hidden="true"><AdminIcon name="lock" /></div>
              <p>DEI / SECURE ACCESS</p>
              <h1 id="admin-access-title">Управление каталогом</h1>
              <p className="admin-access__lead">Введите пароль администратора. На локальном сервере пароль не требуется — просто нажмите кнопку входа.</p>
              <form onSubmit={loadCatalog} className="admin-access__form">
                <label>
                  <span>Пароль администратора</span>
                  <input
                    type="password"
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                    placeholder="Введите пароль"
                    autoComplete="current-password"
                    autoFocus
                  />
                </label>
                <button type="submit" disabled={loading}>{loading ? "Проверяем доступ…" : "Войти в панель"}<AdminIcon name="arrow" /></button>
              </form>
              <small>Доступ к изменению товаров защищён серверным токеном.</small>
            </section>
          ) : (
            <>
              <section className="admin-page-heading">
                <div>
                  <p>DEI / {currentSection.code}</p>
                  <h1>{currentSection.title}</h1>
                  <span>{currentSection.description}</span>
                </div>
                {activeSection === "products" && <button type="button" className="admin-primary-action" onClick={createProduct}><AdminIcon name="plus" />Добавить товар</button>}
                {activeSection === "categories" && <button type="button" className="admin-primary-action" onClick={createCategory}><AdminIcon name="plus" />Добавить категорию</button>}
              </section>

              {activeSection === "products" && (
                <section className="admin-section-stack" aria-label="Управление товарами">
                  <div className="admin-metrics">
                    <article><span>Всего товаров</span><strong>{products.length}</strong><small>В каталоге сайта</small></article>
                    <article><span>В наличии</span><strong>{inStockProducts}</strong><small>Готовы к поставке</small></article>
                    <article><span>Рекомендуемые</span><strong>{featuredProducts}</strong><small>Выделены в каталоге</small></article>
                    <article><span>Хранилище</span><strong className="is-word">{localMode ? "Локально" : "Сервер"}</strong><small>Источник данных</small></article>
                  </div>

                  <div className="admin-panel">
                    <div className="admin-panel__toolbar">
                      <div>
                        <h2>Товары <span>{filteredProducts.length}</span></h2>
                        <p>Фото, описание, цена и статус публикации.</p>
                      </div>
                      <div className="admin-panel__tools">
                        <label className="admin-search">
                          <AdminIcon name="search" />
                          <span className="sr-only">Поиск товаров</span>
                          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по названию…" />
                        </label>
                        <button type="button" className="admin-icon-button" onClick={() => void loadCatalog()} disabled={loading} aria-label="Обновить каталог"><AdminIcon name="refresh" /></button>
                      </div>
                    </div>

                    <div className="admin-table-wrap">
                      <table className="admin-data-table">
                        <thead><tr><th>Товар</th><th>Категория</th><th>Цена</th><th>Наличие</th><th>На сайте</th><th><span className="sr-only">Действия</span></th></tr></thead>
                        <tbody>
                          {filteredProducts.map((product) => (
                            <tr key={product.slug}>
                              <td>
                                <div className="admin-product-cell">
                                  <span className="admin-product-cell__image"><Image src={product.img} alt="" fill sizes="48px" className="object-contain" /></span>
                                  <span><strong>{product.shortName || product.name}</strong><small>{product.sku || product.slug}</small></span>
                                </div>
                              </td>
                              <td><span className="admin-table-secondary">{product.categoryLabel}</span></td>
                              <td><strong className="admin-table-price">{product.price}</strong></td>
                              <td><span className={`admin-status ${availabilityClass(product.availabilityStatus)}`}><i />{availabilityLabel(product.availabilityStatus)}</span></td>
                              <td><Link href={`/catalog/${product.slug}`} className="admin-public-link" aria-label={`Открыть ${product.shortName || product.name} на сайте`}><AdminIcon name="external" /></Link></td>
                              <td><button type="button" className="admin-edit-button" onClick={() => editProduct(product)}>Изменить</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {filteredProducts.length === 0 && <div className="admin-table-empty"><AdminIcon name="box" /><strong>Ничего не найдено</strong><span>Измените запрос или добавьте новый товар.</span></div>}
                    </div>
                  </div>
                </section>
              )}

              {activeSection === "categories" && (
                <section className="admin-section-stack" aria-label="Управление категориями">
                  <div className="admin-metrics admin-metrics--three">
                    <article><span>Всего категорий</span><strong>{categories.length}</strong><small>Разделы каталога</small></article>
                    <article><span>С товарами</span><strong>{assignedCategories}</strong><small>Активные разделы</small></article>
                    <article><span>Пустые</span><strong>{categories.length - assignedCategories}</strong><small>Можно наполнить</small></article>
                  </div>

                  <div className="admin-panel">
                    <div className="admin-panel__toolbar">
                      <div><h2>Категории <span>{categories.length}</span></h2><p>Структура, подписи и порядок разделов каталога.</p></div>
                    </div>
                    <div className="admin-table-wrap">
                      <table className="admin-data-table admin-category-table">
                        <thead><tr><th>Название</th><th>Ключ</th><th>Товаров</th><th>Сортировка</th><th><span className="sr-only">Действия</span></th></tr></thead>
                        <tbody>
                          {categories.map((category) => {
                            const count = products.filter((product) => product.category === category.key).length;
                            return (
                              <tr key={category.key}>
                                <td><div className="admin-category-cell"><span><AdminIcon name="tag" /></span><div><strong>{category.label}</strong><small>{category.description || "Описание пока не заполнено"}</small></div></div></td>
                                <td><code>{category.key}</code></td>
                                <td><strong>{count}</strong></td>
                                <td><span className="admin-table-secondary">{category.sortOrder ?? "—"}</span></td>
                                <td><button type="button" className="admin-edit-button" onClick={() => editCategory(category)}>Изменить</button></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              )}

              {currentSection.development && <DevelopmentSection section={currentSection} />}
            </>
          )}
        </div>
      </main>

      {editorPanel && (
        <div className="admin-drawer-layer" onKeyDown={(event) => { if (event.key === "Escape") closeEditor(); }}>
          <button type="button" className="admin-drawer-layer__backdrop" onClick={closeEditor} aria-label="Закрыть редактор" />
          <aside className="admin-drawer" role="dialog" aria-modal="true" aria-labelledby="admin-editor-title">
            <header className="admin-drawer__header">
              <div><span>{editorPanel === "product" ? (form.slug ? "Редактирование товара" : "Новый товар") : (categoryForm.originalKey ? "Редактирование категории" : "Новая категория")}</span><h2 id="admin-editor-title">{editorPanel === "product" ? "Карточка товара" : "Категория"}</h2></div>
              <button type="button" className="admin-icon-button" onClick={closeEditor} aria-label="Закрыть" autoFocus><AdminIcon name="close" /></button>
            </header>

            {editorPanel === "product" ? (
              <form onSubmit={saveCurrentProduct} className="admin-drawer__form">
                <div className="admin-image-editor">
                  <div className="admin-image-editor__preview">
                    {form.img.startsWith("/") ? <Image src={form.img} alt={form.name || "Фото товара"} fill sizes="520px" className="object-contain" /> : <span><AdminIcon name="image" />{form.img ? "Для предпросмотра загрузите файл" : "Фото товара"}</span>}
                  </div>
                  <div className="admin-image-editor__actions">
                    <label className="admin-upload-button">{uploading ? "Загрузка…" : "Загрузить фото"}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} disabled={uploading} /></label>
                    <small>JPG, PNG или WEBP до 8 МБ</small>
                  </div>
                </div>

                <FormSection title="Основное">
                  <Field label="Slug" value={form.slug} onChange={setField("slug")} placeholder="product-name" required disabled={products.some((product) => product.slug === form.slug)} />
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

                <div className="admin-drawer__footer"><button type="button" className="is-danger" disabled={!form.slug || saving} onClick={deleteCurrentProduct}>Скрыть товар</button><button type="submit" disabled={saving || uploading}>{saving ? "Сохранение…" : "Сохранить товар"}</button></div>
              </form>
            ) : (
              <form onSubmit={saveCategory} className="admin-drawer__form admin-drawer__form--category">
                <FormSection title="Параметры категории">
                  <Field label="Ключ латиницей" value={categoryForm.key} onChange={(event) => { setCategoryDirty(true); setCategoryForm((current) => ({ ...current, key: event.target.value })); }} placeholder="welding-machines" required disabled={Boolean(categoryForm.originalKey)} />
                  <Field label="Название" value={categoryForm.label} onChange={(event) => { setCategoryDirty(true); setCategoryForm((current) => ({ ...current, label: event.target.value })); }} required />
                  <TextArea label="Описание" value={categoryForm.description} onChange={(event) => { setCategoryDirty(true); setCategoryForm((current) => ({ ...current, description: event.target.value })); }} rows={5} />
                  <Field label="Порядок сортировки" value={categoryForm.sortOrder} onChange={(event) => { setCategoryDirty(true); setCategoryForm((current) => ({ ...current, sortOrder: event.target.value })); }} type="number" placeholder="10" />
                </FormSection>
                {categoryForm.originalKey && <div className="admin-category-usage"><span>Используется в товарах</span><strong>{selectedCategoryUsage}</strong></div>}
                <div className="admin-drawer__footer"><button type="button" className="is-danger" disabled={!categoryForm.originalKey || saving || selectedCategoryUsage > 0} onClick={deleteCategory}>Удалить</button><button type="submit" disabled={saving}>{saving ? "Сохранение…" : "Сохранить категорию"}</button></div>
              </form>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function DevelopmentSection({ section }: { section: AdminSectionDefinition }) {
  return (
    <section className="admin-development" aria-labelledby={`admin-${section.id}-title`}>
      <div className="admin-development__icon"><AdminIcon name={section.icon} /></div>
      <span>Следующий этап</span>
      <h2 id={`admin-${section.id}-title`}>В разработке</h2>
      <p>{section.description}</p>
      <div className="admin-development__timeline" aria-hidden="true"><i className="is-ready" /><i /><i /></div>
      <small>Сейчас приоритет — быстро наполнить каталог и запустить сайт как витрину.</small>
    </section>
  );
}

function AdminIcon({ name }: { name: AdminIconName }) {
  let content: React.ReactNode;

  if (name === "box") content = <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="M4 7v10l8 4 8-4V7M12 11v10" /></>;
  else if (name === "tag") content = <><path d="M20 13 13 20l-9-9V4h7l9 9Z" /><circle cx="8.5" cy="8.5" r="1.25" /></>;
  else if (name === "orders") content = <><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h8M8 16h5" /></>;
  else if (name === "analytics") content = <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>;
  else if (name === "import") content = <><path d="M12 3v12M7 10l5 5 5-5" /><path d="M5 20h14" /></>;
  else if (name === "home") content = <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>;
  else if (name === "menu") content = <><path d="M4 7h16M4 12h16M4 17h16" /></>;
  else if (name === "close") content = <><path d="m6 6 12 12M18 6 6 18" /></>;
  else if (name === "plus") content = <><path d="M12 5v14M5 12h14" /></>;
  else if (name === "refresh") content = <><path d="M20 7v5h-5" /><path d="M19 12a7 7 0 1 0-2 5" /></>;
  else if (name === "lock") content = <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>;
  else if (name === "arrow") content = <><path d="M5 12h14M14 7l5 5-5 5" /></>;
  else if (name === "search") content = <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>;
  else if (name === "external") content = <><path d="M14 4h6v6M20 4l-9 9" /><path d="M18 13v6H5V6h6" /></>;
  else if (name === "image") content = <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m3 16 5-5 4 4 3-3 6 6" /></>;
  else content = null;

  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{content}</svg>;
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
