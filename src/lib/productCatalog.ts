import { neon } from "@neondatabase/serverless";
import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";
import {
  PRODUCTS,
  type Product,
  type ProductAvailabilityStatus,
  type ProductDocument,
  type ProductGalleryImage,
  type ProductSpec,
  type ProductVariant,
} from "@/data/products";

export type ProductCategory = Product["category"];

export type ProductMutationResult = {
  status: "saved" | "deleted" | "failed";
  message: string;
  product?: Product;
};

const PRODUCT_FILE_NAME = "products.jsonl";
const CATEGORY_KEYS = new Set<ProductCategory>(["welding", "light", "centrators", "consumables"]);
const AVAILABILITY_STATUSES = new Set<ProductAvailabilityStatus>(["in_stock", "on_order", "preorder", "out_of_stock"]);

type SqlClient = ReturnType<typeof neon>;

type ProductRecord = {
  schemaVersion: "product/v0";
  product: Product;
  deleted?: boolean;
  updatedAt: string;
};

let dbClient: SqlClient | null = null;
let dbClientUrl: string | null = null;
let ensureProductsTablePromise: Promise<void> | null = null;

function getProductStorageDir() {
  return process.env.PRODUCT_STORAGE_DIR?.trim() || process.env.ORDER_STORAGE_DIR?.trim() || path.join(process.cwd(), ".data");
}

function getProductStorageFile() {
  return path.join(getProductStorageDir(), PRODUCT_FILE_NAME);
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
  const category = normalizeText(value.category) as ProductCategory;
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
    !CATEGORY_KEYS.has(category) ||
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
  return sql ? listProductsFromDatabase(sql) : listProductsFromJsonl();
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
    UPDATE products
    SET active = FALSE, updated_at = NOW()
    WHERE slug = ${slug}
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
