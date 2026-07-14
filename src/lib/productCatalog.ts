import { neon } from "@neondatabase/serverless";
import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";
import {
  DEFAULT_CATEGORIES,
  PRODUCTS,
  type Product,
  type ProductAvailabilityStatus,
  type ProductCategory,
  type ProductDocument,
  type ProductGalleryImage,
  type ProductSpec,
  type ProductVariant,
} from "@/data/products";

export type ProductMutationResult = {
  status: "saved" | "deleted" | "failed";
  message: string;
  product?: Product;
};

export type CategoryMutationResult = {
  status: "saved" | "deleted" | "failed";
  message: string;
  category?: ProductCategory;
};

const PRODUCT_FILE_NAME = "products.jsonl";
const CATEGORY_FILE_NAME = "categories.jsonl";
const AVAILABILITY_STATUSES = new Set<ProductAvailabilityStatus>(["in_stock", "on_order", "preorder", "out_of_stock"]);
const LEGACY_PRODUCT_SLUGS = new Set([
  "proton-dei-vdi-200",
  "proton-dei-vdi-180",
  "proton-dei-vdu-315",
  "led-dei-120",
  "led-dei-60-street",
  "led-dei-40-warehouse",
  "czn-159-426",
  "csn-57-159",
  "electrody-mr3",
  "electrody-uoni",
]);

type SqlClient = ReturnType<typeof neon>;

type ProductRecord = {
  schemaVersion: "product/v0";
  product: Product;
  deleted?: boolean;
  updatedAt: string;
};

type CategoryRecord = {
  schemaVersion: "product-category/v1";
  category: ProductCategory;
  deleted?: boolean;
  updatedAt: string;
};

let dbClient: SqlClient | null = null;
let dbClientUrl: string | null = null;
let ensureProductsTablePromise: Promise<void> | null = null;
let ensureCategoriesTablePromise: Promise<void> | null = null;

function getProductStorageDir() {
  return process.env.PRODUCT_STORAGE_DIR?.trim() || process.env.ORDER_STORAGE_DIR?.trim() || path.join(process.cwd(), ".data");
}

function getProductStorageFile() {
  return path.join(getProductStorageDir(), PRODUCT_FILE_NAME);
}

function getCategoryStorageFile() {
  return path.join(getProductStorageDir(), CATEGORY_FILE_NAME);
}

function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() || "";
}

function getDbClient() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) return null;

  if (!dbClient || dbClientUrl !== databaseUrl) {
    dbClient = neon(databaseUrl);
    dbClientUrl = databaseUrl;
    ensureProductsTablePromise = null;
    ensureCategoriesTablePromise = null;
  }

  return dbClient;
}

async function ensureProductsTable(sql: SqlClient) {
  if (!ensureProductsTablePromise) {
    ensureProductsTablePromise = sql`
      CREATE TABLE IF NOT EXISTS products (
        slug TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price_num INTEGER NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        payload JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.then(() => undefined);
  }

  return ensureProductsTablePromise;
}

async function ensureCategoriesTable(sql: SqlClient) {
  if (!ensureCategoriesTablePromise) {
    ensureCategoriesTablePromise = sql`
      CREATE TABLE IF NOT EXISTS product_categories (
        key TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        payload JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `.then(() => undefined);
  }

  return ensureCategoriesTablePromise;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeBoolean(value: unknown) {
  return value === true;
}

function normalizeSpec(value: unknown): ProductSpec | null {
  if (!isRecord(value)) return null;

  const label = normalizeText(value.label);
  const specValue = normalizeText(value.value);
  if (!label || !specValue) return null;

  return { label, value: specValue };
}

function normalizeTextArray(value: unknown) {
  return Array.isArray(value) ? value.map(normalizeText).filter(Boolean) : [];
}

function normalizeOptionalText(value: unknown) {
  const text = normalizeText(value);
  return text || undefined;
}

function normalizeOptionalNumber(value: unknown, min = 0) {
  if (value === undefined || value === null || value === "") return undefined;

  const number = Number(value);
  return Number.isFinite(number) && number >= min ? number : undefined;
}

export function normalizeCategoryInput(value: unknown): ProductCategory | null {
  if (!isRecord(value)) return null;

  const key = normalizeText(value.key).toLowerCase();
  const label = normalizeText(value.label);
  const description = normalizeOptionalText(value.description);
  const normalizedSortOrder = normalizeOptionalNumber(value.sortOrder);
  const sortOrder = normalizedSortOrder !== undefined && Number.isInteger(normalizedSortOrder)
    ? normalizedSortOrder
    : undefined;

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key) || !label) return null;

  return {
    key,
    label,
    ...(description ? { description } : {}),
    ...(sortOrder !== undefined ? { sortOrder } : {}),
  };
}

function normalizeAvailabilityStatus(value: unknown): ProductAvailabilityStatus | undefined {
  const status = normalizeText(value) as ProductAvailabilityStatus;
  return AVAILABILITY_STATUSES.has(status) ? status : undefined;
}

function normalizeGalleryImage(value: unknown): ProductGalleryImage | null {
  if (!isRecord(value)) return null;

  const url = normalizeText(value.url);
  if (!url) return null;

  return {
    url,
    ...(normalizeOptionalText(value.alt) ? { alt: normalizeOptionalText(value.alt) } : {}),
    ...(normalizeOptionalText(value.title) ? { title: normalizeOptionalText(value.title) } : {}),
  };
}

function normalizeProductDocument(value: unknown): ProductDocument | null {
  if (!isRecord(value)) return null;

  const type = normalizeText(value.type);
  const title = normalizeText(value.title);
  const url = normalizeText(value.url);
  if (!type || !title || !url) return null;

  return { type, title, url };
}

function normalizeVariantOptions(value: unknown) {
  if (!isRecord(value)) return undefined;

  const entries = Object.entries(value)
    .map(([key, optionValue]) => [normalizeText(key), normalizeText(optionValue)] as const)
    .filter(([key, optionValue]) => key && optionValue);

  return entries.length ? Object.fromEntries(entries) : undefined;
}

function normalizeProductVariant(value: unknown): ProductVariant | null {
  if (!isRecord(value)) return null;

  const title = normalizeText(value.title);
  if (!title) return null;

  return {
    title,
    ...(normalizeOptionalText(value.sku) ? { sku: normalizeOptionalText(value.sku) } : {}),
    ...(normalizeVariantOptions(value.options) ? { options: normalizeVariantOptions(value.options) } : {}),
    ...(normalizeOptionalNumber(value.price) !== undefined ? { price: normalizeOptionalNumber(value.price) } : {}),
    ...(normalizeOptionalNumber(value.stock) !== undefined ? { stock: normalizeOptionalNumber(value.stock) } : {}),
    ...(normalizeOptionalText(value.leadTime) ? { leadTime: normalizeOptionalText(value.leadTime) } : {}),
  };
}

function normalizeArray<T>(value: unknown, normalizeItem: (item: unknown) => T | null) {
  if (!Array.isArray(value)) return undefined;

  const items = value.map(normalizeItem).filter((item): item is T => item !== null);
  return items.length ? items : undefined;
}

export function normalizeProductInput(value: unknown): Product | null {
  if (!isRecord(value)) return null;

  const slug = normalizeText(value.slug).toLowerCase();
  const name = normalizeText(value.name);
  const shortName = normalizeText(value.shortName);
  const category = normalizeText(value.category).toLowerCase();
  const categoryLabel = normalizeText(value.categoryLabel);
  const price = normalizeText(value.price);
  const priceNum = Number(value.priceNum);
  const img = normalizeText(value.img);
  const description = normalizeText(value.description);
  const fullDescription = normalizeText(value.fullDescription);
  const specs = Array.isArray(value.specs) ? value.specs.map(normalizeSpec).filter((spec): spec is ProductSpec => spec !== null) : [];
  const tags = normalizeTextArray(value.tags);

  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    !name ||
    !shortName ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category) ||
    !categoryLabel ||
    !price ||
    !Number.isInteger(priceNum) ||
    priceNum < 0 ||
    !img ||
    !description ||
    !fullDescription
  ) {
    return null;
  }

  const product: Product = {
    slug,
    name,
    shortName,
    category,
    categoryLabel,
    price,
    priceNum,
    img,
    description,
    fullDescription,
    specs,
    tags,
    naks: normalizeBoolean(value.naks),
    featured: normalizeBoolean(value.featured),
  };

  const optionalFields: Partial<Product> = {
    sku: normalizeOptionalText(value.sku),
    brand: normalizeOptionalText(value.brand),
    manufacturer: normalizeOptionalText(value.manufacturer),
    model: normalizeOptionalText(value.model),
    series: normalizeOptionalText(value.series),
    subcategory: normalizeOptionalText(value.subcategory),
    availabilityStatus: normalizeAvailabilityStatus(value.availabilityStatus),
    stockQuantity: normalizeOptionalNumber(value.stockQuantity),
    leadTime: normalizeOptionalText(value.leadTime),
    deliveryNote: normalizeOptionalText(value.deliveryNote),
    saleUnit: normalizeOptionalText(value.saleUnit),
    minOrderQuantity: normalizeOptionalNumber(value.minOrderQuantity, 1),
    oldPrice: normalizeOptionalNumber(value.oldPrice),
    wholesalePrice: normalizeOptionalNumber(value.wholesalePrice),
    vatRate: normalizeOptionalNumber(value.vatRate),
    vatIncluded: value.vatIncluded === undefined ? undefined : normalizeBoolean(value.vatIncluded),
    gallery: normalizeArray(value.gallery, normalizeGalleryImage),
    documents: normalizeArray(value.documents, normalizeProductDocument),
    seoTitle: normalizeOptionalText(value.seoTitle),
    seoDescription: normalizeOptionalText(value.seoDescription),
    sortOrder: normalizeOptionalNumber(value.sortOrder),
    variants: normalizeArray(value.variants, normalizeProductVariant),
  };

  Object.entries(optionalFields).forEach(([key, optionalValue]) => {
    if (optionalValue !== undefined) {
      product[key as keyof Product] = optionalValue as never;
    }
  });

  return product;
}

function isProduct(value: unknown): value is Product {
  return normalizeProductInput(value) !== null;
}

function isProductRecord(value: unknown): value is ProductRecord {
  if (!isRecord(value)) return false;

  return value.schemaVersion === "product/v0" && isProduct(value.product) && typeof value.updatedAt === "string";
}

function isCategoryRecord(value: unknown): value is CategoryRecord {
  if (!isRecord(value)) return false;

  return value.schemaVersion === "product-category/v1" && normalizeCategoryInput(value.category) !== null && typeof value.updatedAt === "string";
}

function seedCategoryMap() {
  return new Map(DEFAULT_CATEGORIES.map((category) => [category.key, category]));
}

async function listCategoriesFromJsonl() {
  const categories = seedCategoryMap();

  try {
    const content = await readFile(getCategoryStorageFile(), "utf8");
    content
      .split("\n")
      .filter(Boolean)
      .forEach((line) => {
        try {
          const record = JSON.parse(line) as unknown;
          if (!isCategoryRecord(record)) return;

          if (record.deleted) {
            categories.delete(record.category.key);
          } else {
            categories.set(record.category.key, record.category);
          }
        } catch {
          // Одна битая строка не должна ломать весь справочник категорий.
        }
      });
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) {
      throw error;
    }
  }

  return Array.from(categories.values()).sort((left, right) =>
    (left.sortOrder ?? 0) - (right.sortOrder ?? 0) || left.label.localeCompare(right.label, "ru")
  );
}

async function listCategoriesFromDatabase(sql: SqlClient) {
  await ensureCategoriesTable(sql);
  const rows = await sql`
    SELECT key, active, payload
    FROM product_categories
    ORDER BY sort_order ASC, updated_at ASC
  ` as Array<{ key: unknown; active: unknown; payload: unknown }>;

  const categories = seedCategoryMap();
  rows.forEach((row) => {
    const key = normalizeText(row.key);
    if (!key) return;

    if (row.active === false) {
      categories.delete(key);
      return;
    }

    const category = normalizeCategoryInput(row.payload);
    if (category) categories.set(category.key, category);
  });

  return Array.from(categories.values()).sort((left, right) =>
    (left.sortOrder ?? 0) - (right.sortOrder ?? 0) || left.label.localeCompare(right.label, "ru")
  );
}

export async function listProductCategories(): Promise<ProductCategory[]> {
  const sql = getDbClient();
  return sql ? listCategoriesFromDatabase(sql) : listCategoriesFromJsonl();
}

function seedProductMap() {
  return new Map(PRODUCTS.map((product) => [product.slug, product]));
}

async function listProductsFromJsonl() {
  const products = seedProductMap();

  try {
    const content = await readFile(getProductStorageFile(), "utf8");
    content
      .split("\n")
      .filter(Boolean)
      .forEach((line) => {
        try {
          const record = JSON.parse(line) as unknown;
          if (!isProductRecord(record)) return;
          if (LEGACY_PRODUCT_SLUGS.has(record.product.slug)) return;

          if (record.deleted) {
            products.delete(record.product.slug);
          } else {
            products.set(record.product.slug, record.product);
          }
        } catch {
          // Пропускаем битую строку журнала, чтобы один сбой не ломал каталог.
        }
      });
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) {
      throw error;
    }
  }

  return Array.from(products.values());
}

async function listProductsFromDatabase(sql: SqlClient) {
  await ensureProductsTable(sql);
  const rows = await sql`
    SELECT slug, active, payload
    FROM products
    ORDER BY updated_at ASC
  ` as Array<{ slug: unknown; active: unknown; payload: unknown }>;

  const products = seedProductMap();
  rows.forEach((row) => {
    const slug = normalizeText(row.slug);
    if (!slug) return;
    if (LEGACY_PRODUCT_SLUGS.has(slug)) return;

    if (row.active === false) {
      products.delete(slug);
      return;
    }

    const product = normalizeProductInput(row.payload);
    if (product) {
      products.set(product.slug, product);
    }
  });

  return Array.from(products.values());
}

export async function listProducts(): Promise<Product[]> {
  const sql = getDbClient();
  const [products, categories] = await Promise.all([
    sql ? listProductsFromDatabase(sql) : listProductsFromJsonl(),
    listProductCategories(),
  ]);
  const categoryLabels = new Map(categories.map((category) => [category.key, category.label]));

  return products.map((product) => ({
    ...product,
    categoryLabel: categoryLabels.get(product.category) || product.categoryLabel,
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await listProducts();
  return products.find((product) => product.slug === slug);
}

async function saveProductToJsonl(product: Product) {
  const dir = getProductStorageDir();
  await mkdir(dir, { recursive: true });
  await appendFile(
    getProductStorageFile(),
    `${JSON.stringify({ schemaVersion: "product/v0", product, updatedAt: new Date().toISOString() } satisfies ProductRecord)}\n`,
    "utf8"
  );
}

async function saveProductToDatabase(sql: SqlClient, product: Product) {
  await ensureProductsTable(sql);
  await sql`
    INSERT INTO products (slug, name, category, price_num, active, payload, updated_at)
    VALUES (${product.slug}, ${product.name}, ${product.category}, ${product.priceNum}, TRUE, ${JSON.stringify(product)}::jsonb, NOW())
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      category = EXCLUDED.category,
      price_num = EXCLUDED.price_num,
      active = TRUE,
      payload = EXCLUDED.payload,
      updated_at = NOW()
  `;
}

export async function saveProduct(input: unknown): Promise<ProductMutationResult> {
  const product = normalizeProductInput(input);
  if (!product) {
    return {
      status: "failed",
      message: "Товар не сохранен: проверьте обязательные поля, slug, категорию и цену.",
    };
  }

  try {
    const categories = await listProductCategories();
    const category = categories.find((item) => item.key === product.category);
    if (!category) {
      return {
        status: "failed",
        message: "Товар не сохранен: выбранная категория не существует.",
      };
    }

    product.categoryLabel = category.label;
    const sql = getDbClient();
    if (sql) {
      await saveProductToDatabase(sql, product);
    } else {
      await saveProductToJsonl(product);
    }

    return {
      status: "saved",
      message: "Товар сохранен.",
      product,
    };
  } catch {
    return {
      status: "failed",
      message: "Товар не сохранен: хранилище каталога сейчас недоступно.",
    };
  }
}

async function saveCategoryToJsonl(category: ProductCategory) {
  const dir = getProductStorageDir();
  await mkdir(dir, { recursive: true });
  await appendFile(
    getCategoryStorageFile(),
    `${JSON.stringify({ schemaVersion: "product-category/v1", category, updatedAt: new Date().toISOString() } satisfies CategoryRecord)}\n`,
    "utf8"
  );
}

async function saveCategoryToDatabase(sql: SqlClient, category: ProductCategory) {
  await ensureCategoriesTable(sql);
  await sql`
    INSERT INTO product_categories (key, label, sort_order, active, payload, updated_at)
    VALUES (${category.key}, ${category.label}, ${category.sortOrder ?? 0}, TRUE, ${JSON.stringify(category)}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE SET
      label = EXCLUDED.label,
      sort_order = EXCLUDED.sort_order,
      active = TRUE,
      payload = EXCLUDED.payload,
      updated_at = NOW()
  `;
}

export async function saveProductCategory(input: unknown): Promise<CategoryMutationResult> {
  const category = normalizeCategoryInput(input);
  if (!category) {
    return {
      status: "failed",
      message: "Категория не сохранена: укажите ключ латиницей и название.",
    };
  }

  try {
    const sql = getDbClient();
    if (sql) {
      await saveCategoryToDatabase(sql, category);
    } else {
      await saveCategoryToJsonl(category);
    }

    return {
      status: "saved",
      message: "Категория сохранена.",
      category,
    };
  } catch {
    return {
      status: "failed",
      message: "Категория не сохранена: хранилище каталога сейчас недоступно.",
    };
  }
}

async function deleteProductFromJsonl(product: Product) {
  const dir = getProductStorageDir();
  await mkdir(dir, { recursive: true });
  await appendFile(
    getProductStorageFile(),
    `${JSON.stringify({ schemaVersion: "product/v0", product, deleted: true, updatedAt: new Date().toISOString() } satisfies ProductRecord)}\n`,
    "utf8"
  );
}

async function deleteProductFromDatabase(sql: SqlClient, slug: string) {
  await ensureProductsTable(sql);
  await sql`
    INSERT INTO products (slug, name, category, price_num, active, payload, updated_at)
    VALUES (${slug}, ${slug}, ${"hidden"}, ${0}, FALSE, ${JSON.stringify({})}::jsonb, NOW())
    ON CONFLICT (slug) DO UPDATE SET
      active = FALSE,
      updated_at = NOW()
  `;
}

export async function deleteProduct(slug: string): Promise<ProductMutationResult> {
  const normalizedSlug = normalizeText(slug).toLowerCase();
  if (!normalizedSlug) {
    return {
      status: "failed",
      message: "Товар не удален: slug не указан.",
    };
  }

  try {
    const product = await getProductBySlug(normalizedSlug);
    if (!product) {
      return {
        status: "failed",
        message: "Товар не найден.",
      };
    }

    const sql = getDbClient();
    if (sql) {
      await deleteProductFromDatabase(sql, normalizedSlug);
    } else {
      await deleteProductFromJsonl(product);
    }

    return {
      status: "deleted",
      message: "Товар скрыт из каталога.",
      product,
    };
  } catch {
    return {
      status: "failed",
      message: "Товар не удален: хранилище каталога сейчас недоступно.",
    };
  }
}

async function deleteCategoryFromJsonl(category: ProductCategory) {
  const dir = getProductStorageDir();
  await mkdir(dir, { recursive: true });
  await appendFile(
    getCategoryStorageFile(),
    `${JSON.stringify({ schemaVersion: "product-category/v1", category, deleted: true, updatedAt: new Date().toISOString() } satisfies CategoryRecord)}\n`,
    "utf8"
  );
}

async function deleteCategoryFromDatabase(sql: SqlClient, category: ProductCategory) {
  await ensureCategoriesTable(sql);
  await sql`
    INSERT INTO product_categories (key, label, sort_order, active, payload, updated_at)
    VALUES (${category.key}, ${category.label}, ${category.sortOrder ?? 0}, FALSE, ${JSON.stringify(category)}::jsonb, NOW())
    ON CONFLICT (key) DO UPDATE SET
      active = FALSE,
      updated_at = NOW()
  `;
}

export async function deleteProductCategory(key: string): Promise<CategoryMutationResult> {
  const normalizedKey = normalizeText(key).toLowerCase();
  if (!normalizedKey) {
    return { status: "failed", message: "Категория не удалена: ключ не указан." };
  }

  try {
    const [categories, products] = await Promise.all([listProductCategories(), listProducts()]);
    const category = categories.find((item) => item.key === normalizedKey);
    if (!category) {
      return { status: "failed", message: "Категория не найдена." };
    }

    const productsInCategory = products.filter((product) => product.category === normalizedKey).length;
    if (productsInCategory > 0) {
      return {
        status: "failed",
        message: `Сначала перенесите ${productsInCategory} товар(а/ов) в другую категорию.`,
      };
    }

    const sql = getDbClient();
    if (sql) {
      await deleteCategoryFromDatabase(sql, category);
    } else {
      await deleteCategoryFromJsonl(category);
    }

    return { status: "deleted", message: "Категория удалена.", category };
  } catch {
    return {
      status: "failed",
      message: "Категория не удалена: хранилище каталога сейчас недоступно.",
    };
  }
}
