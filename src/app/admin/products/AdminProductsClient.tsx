"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CATEGORIES, type Product, type ProductAvailabilityStatus, type ProductSpec } from "@/data/products";

type ProductsResponse =
  | { ok: true; products: Product[]; count: number }
  | { ok: false; message?: string };

type ProductMutationResponse =
  | { ok: true; product?: Product; message: string }
  | { ok: false; message?: string };

type FormState = {
  slug: string;
  name: string;
  shortName: string;
  category: Product["category"];
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

const emptyForm: FormState = {
  slug: "",
  name: "",
  shortName: "",
  category: "welding",
  categoryLabel: "",
  sku: "",
  brand: "",
  manufacturer: "",
  model: "",
  series: "",
  price: "",
  priceNum: "",
  oldPrice: "",
  wholesalePrice: "",
  vatRate: "",
  vatIncluded: true,
  availabilityStatus: "",
  stockQuantity: "",
  leadTime: "",
  saleUnit: "",
  minOrderQuantity: "",
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
  const text = value.trim();
  return text || undefined;
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

function formToProduct(form: FormState): Product {
  const product: Product = {
    slug: form.slug.trim().toLowerCase(),
    name: form.name.trim(),
    shortName: form.shortName.trim(),
    category: form.category,
    categoryLabel: form.categoryLabel.trim(),
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
    if (value !== undefined) {
      product[key as keyof Product] = value as never;
    }
  });

  return product;
}

export default function AdminProductsClient() {
  const [token, setToken] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return products;

    return products.filter((product) =>
      [product.slug, product.name, product.shortName, product.categoryLabel]
        .some((value) => value.toLowerCase().includes(normalizedQuery))
    );
  }, [products, query]);

  const setField = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = event.target instanceof HTMLInputElement && event.target.type === "checkbox"
      ? event.target.checked
      : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };

  const loadProducts = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/products", {
        headers: { "x-admin-token": token.trim() },
      });
      const data = (await response.json().catch(() => null)) as ProductsResponse | null;

      if (!data) throw new Error("Не удалось прочитать каталог.");
      if (!data.ok) throw new Error(data.message || "Доступ к каталогу отклонен.");
      if (!response.ok) throw new Error("Доступ к каталогу отклонен.");

      setProducts(data.products);
      setLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось прочитать каталог.");
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token.trim()) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token.trim(),
        },
        body: JSON.stringify(formToProduct(form)),
      });
      const data = (await response.json().catch(() => null)) as ProductMutationResponse | null;

      if (!data) throw new Error("Не удалось сохранить товар.");
      if (!data.ok) throw new Error(data.message || "Товар не сохранен.");
      if (!response.ok) throw new Error("Товар не сохранен.");

      setMessage(data.message);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить товар.");
    } finally {
      setSaving(false);
    }
  };

  const deleteCurrentProduct = async () => {
    if (!token.trim() || !form.slug.trim()) return;
    const confirmed = window.confirm(
      `Скрыть товар "${form.name || form.slug}" из публичного каталога? Его можно будет вернуть, сохранив карточку заново.`
    );

    if (!confirmed) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/products?slug=${encodeURIComponent(form.slug.trim())}`, {
        method: "DELETE",
        headers: { "x-admin-token": token.trim() },
      });
      const data = (await response.json().catch(() => null)) as ProductMutationResponse | null;

      if (!data) throw new Error("Не удалось скрыть товар.");
      if (!data.ok) throw new Error(data.message || "Товар не скрыт.");
      if (!response.ok) throw new Error("Товар не скрыт.");

      setMessage(data.message);
      setForm(emptyForm);
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось скрыть товар.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dei-admin-page admin-products-page px-4 pb-24 sm:px-6">
      <div className="admin-workbench mx-auto grid max-w-[1280px] gap-6 lg:grid-cols-[minmax(0,1fr)_460px]">
        <section className="admin-list-column min-w-0">
          <header className="admin-v10__header mb-6">
            <div>
            <p className="admin-v10__index">ADMIN / 01</p>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Товары</h1>
            <p className="mt-3 max-w-[640px] text-sm leading-relaxed text-zinc-400">
              Управление рабочим каталогом магазина. После сохранения товар используется на сайте и при оформлении заказов. В локальном запуске изменения остаются на этом компьютере, на сервере сохраняются в подключенном хранилище.
            </p>
            </div>

          <form onSubmit={loadProducts} className="admin-v10__auth">
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Пароль админки"
              autoComplete="current-password"
              className="min-h-11 rounded-xl border border-white/[0.08] bg-black/25 px-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-red-600/50 sm:w-72"
            />
            <button
              type="submit"
              disabled={!token.trim() || loading}
              className="min-h-11 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white btn transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Загрузка..." : loaded ? "Обновить" : "Открыть каталог"}
            </button>
          </form>
          </header>

          {error && <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
          {message && <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{message}</div>}

          <div className="admin-search-panel mb-4 p-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по названию, slug или категории"
              className="w-full rounded-lg border border-white/[0.08] bg-black/25 px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-red-600/50"
            />
          </div>

          <div className="grid gap-3">
            {loaded && filteredProducts.length === 0 && (
              <div className="admin-empty p-8 text-center text-sm text-zinc-500">Товары не найдены.</div>
            )}
            {filteredProducts.map((product) => (
              <button
                key={product.slug}
                type="button"
                onClick={() => setForm(productToForm(product))}
                className="admin-product-row grid min-w-0 gap-3 p-4 text-left sm:grid-cols-[72px_minmax(0,1fr)_150px]"
              >
                <div className="admin-product-thumb relative h-16 w-16 overflow-hidden">
                  <Image src={product.img} alt={product.name} fill sizes="64px" className="object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{product.name}</p>
                  <p className="mt-1 break-all text-xs text-zinc-500">{product.slug}</p>
                  <p className="mt-2 line-clamp-2 text-xs text-zinc-400">{product.description}</p>
                </div>
                <div className="text-sm sm:text-right">
                  <p className="font-bold text-red-400">{product.price}</p>
                  <p className="mt-1 text-xs text-zinc-500">{product.categoryLabel}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <aside className="admin-editor h-fit p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-white">Карточка товара</h2>
            <button type="button" onClick={() => setForm(emptyForm)} className="text-xs text-zinc-500 transition-colors hover:text-red-400">
              Очистить
            </button>
          </div>

          <form onSubmit={saveCurrentProduct} className="grid gap-4">
            <FormSection title="Основное">
              <Field label="Slug" value={form.slug} onChange={setField("slug")} placeholder="new-product-slug" />
              <Field label="Название" value={form.name} onChange={setField("name")} />
              <Field label="Короткое имя" value={form.shortName} onChange={setField("shortName")} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Артикул / SKU" value={form.sku} onChange={setField("sku")} placeholder="DEI-VDI-200" />
                <Field label="Бренд" value={form.brand} onChange={setField("brand")} placeholder="DEI" />
              </div>
              <Field label="Производитель" value={form.manufacturer} onChange={setField("manufacturer")} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Модель" value={form.model} onChange={setField("model")} />
                <Field label="Серия" value={form.series} onChange={setField("series")} />
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-400">Категория</span>
                <select
                  value={form.category}
                  onChange={setField("category")}
                  className="w-full rounded-lg border border-white/[0.08] bg-black/25 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-red-600/50"
                >
                  {CATEGORIES.filter((category) => category.key !== "all").map((category) => (
                    <option key={category.key} value={category.key} style={{ background: "#09090b" }}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
              <Field label="Метка категории" value={form.categoryLabel} onChange={setField("categoryLabel")} />
            </FormSection>

            <FormSection title="Продажи и наличие">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Цена текстом" value={form.price} onChange={setField("price")} placeholder="от 18 500 ₽" />
                <Field label="Цена числом" value={form.priceNum} onChange={setField("priceNum")} type="number" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Старая цена" value={form.oldPrice} onChange={setField("oldPrice")} type="number" />
                <Field label="Оптовая цена" value={form.wholesalePrice} onChange={setField("wholesalePrice")} type="number" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="НДС, %" value={form.vatRate} onChange={setField("vatRate")} type="number" placeholder="20" />
                <Checkbox label="Цена с НДС" checked={form.vatIncluded} onChange={setField("vatIncluded")} />
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-zinc-400">Статус наличия</span>
                <select
                  value={form.availabilityStatus}
                  onChange={setField("availabilityStatus")}
                  className="w-full rounded-lg border border-white/[0.08] bg-black/25 px-3 py-2.5 text-sm text-zinc-100 outline-none focus:border-red-600/50"
                >
                  {AVAILABILITY_OPTIONS.map((option) => (
                    <option key={option.value || "empty"} value={option.value} style={{ background: "#09090b" }}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <Field label="Остаток" value={form.stockQuantity} onChange={setField("stockQuantity")} type="number" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Срок поставки" value={form.leadTime} onChange={setField("leadTime")} placeholder="2-5 дней" />
                <Field label="Единица продажи" value={form.saleUnit} onChange={setField("saleUnit")} placeholder="шт." />
              </div>
              <Field label="Минимальный заказ" value={form.minOrderQuantity} onChange={setField("minOrderQuantity")} type="number" />
            </FormSection>

            <FormSection title="Контент">
              <Field label="Изображение" value={form.img} onChange={setField("img")} placeholder="/products/example.jpg" />
              <TextArea label="Краткое описание" value={form.description} onChange={setField("description")} rows={2} />
              <TextArea label="Полное описание" value={form.fullDescription} onChange={setField("fullDescription")} rows={4} />
              <TextArea label="Характеристики" value={form.specsText} onChange={setField("specsText")} rows={5} hint="Одна строка: Метка: значение" />
              <TextArea label="Теги" value={form.tagsText} onChange={setField("tagsText")} rows={2} hint="Через запятую" />
              <div className="grid gap-2 sm:grid-cols-2">
                <Checkbox label="НАКС" checked={form.naks} onChange={setField("naks")} />
                <Checkbox label="Рекомендуемый" checked={form.featured} onChange={setField("featured")} />
              </div>
            </FormSection>

            <FormSection title="SEO">
              <Field label="SEO title" value={form.seoTitle} onChange={setField("seoTitle")} />
              <TextArea label="SEO description" value={form.seoDescription} onChange={setField("seoDescription")} rows={3} />
            </FormSection>

            <button
              type="submit"
              disabled={!token.trim() || saving}
              className="mt-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white btn transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Сохранение..." : "Сохранить товар"}
            </button>
            <button
              type="button"
              disabled={!token.trim() || !form.slug.trim() || saving}
              onClick={deleteCurrentProduct}
              className="rounded-xl border border-red-500/25 bg-red-500/10 py-3 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Скрыть товар из каталога
            </button>
          </form>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-white/[0.08] bg-black/25 px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-red-600/50"
      />
    </label>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="admin-form-section grid gap-3 p-3">
      <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      {children}
    </section>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows,
  hint,
}: {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full resize-none rounded-lg border border-white/[0.08] bg-black/25 px-3 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-red-600/50"
      />
      {hint && <span className="mt-1 block text-[11px] text-zinc-600">{hint}</span>}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2 text-sm text-zinc-300">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-red-600" />
      {label}
    </label>
  );
}
