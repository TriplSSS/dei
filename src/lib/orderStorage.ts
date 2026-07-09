import { neon } from "@neondatabase/serverless";
import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";

export type StoredPaymentMethod = "invoice" | "online_yookassa";
export type StoredPaymentStatus = "invoice_requested" | "yookassa_draft";

export type StoredCustomer = {
  name: string;
  phone: string;
  email: string;
  company: string;
  inn: string;
  comment: string;
};

export type StoredOrderItem = {
  slug: string;
  name: string;
  price: string;
  priceNum: number;
  qty: number;
  lineTotal: number;
};

export type StoredNotification = {
  status: "sent" | "skipped_config_missing" | "failed";
  message: string;
};

export type StoredOrder = {
  schemaVersion: "order/v0";
  id: string;
  createdAt: string;
  status: "created";
  paymentMethod: StoredPaymentMethod;
  paymentLabel: string;
  paymentStatus: StoredPaymentStatus;
  paymentMessage: string;
  notification: StoredNotification;
  customer: StoredCustomer;
  items: StoredOrderItem[];
  count: number;
  total: number;
};

export type OrderStorageResult = {
  status: "saved" | "failed";
  message: string;
};

const ORDER_FILE_NAME = "orders.jsonl";

type SqlClient = ReturnType<typeof neon>;

let dbClient: SqlClient | null = null;
let dbClientUrl: string | null = null;
let ensureOrdersTablePromise: Promise<void> | null = null;

function getOrderStorageDir() {
  return process.env.ORDER_STORAGE_DIR?.trim() || path.join(process.cwd(), ".data");
}

function getOrderStorageFile() {
  return path.join(getOrderStorageDir(), ORDER_FILE_NAME);
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
    ensureOrdersTablePromise = null;
  }

  return dbClient;
}

async function ensureOrdersTable(sql: SqlClient) {
  if (!ensureOrdersTablePromise) {
    ensureOrdersTablePromise = sql`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL,
        payment_method TEXT NOT NULL,
        payment_status TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        total INTEGER NOT NULL,
        payload JSONB NOT NULL
      )
    `.then(() => undefined);
  }

  return ensureOrdersTablePromise;
}

function isStoredOrder(value: unknown): value is StoredOrder {
  if (!value || typeof value !== "object") return false;

  const record = value as Partial<StoredOrder>;
  return (
    record.schemaVersion === "order/v0" &&
    typeof record.id === "string" &&
    typeof record.createdAt === "string" &&
    record.status === "created" &&
    typeof record.total === "number" &&
    Array.isArray(record.items)
  );
}

async function saveOrderToJsonl(order: StoredOrder): Promise<OrderStorageResult> {
  const dir = getOrderStorageDir();
  await mkdir(dir, { recursive: true });
  await appendFile(getOrderStorageFile(), `${JSON.stringify(order)}\n`, "utf8");

  return {
    status: "saved",
    message: "Заказ сохранен в журнале заявок.",
  };
}

async function saveOrderToDatabase(sql: SqlClient, order: StoredOrder): Promise<OrderStorageResult> {
  await ensureOrdersTable(sql);
  await sql`
    INSERT INTO orders (
      id,
      created_at,
      payment_method,
      payment_status,
      customer_name,
      customer_phone,
      total,
      payload
    )
    VALUES (
      ${order.id},
      ${order.createdAt},
      ${order.paymentMethod},
      ${order.paymentStatus},
      ${order.customer.name},
      ${order.customer.phone},
      ${order.total},
      ${JSON.stringify(order)}::jsonb
    )
    ON CONFLICT (id) DO UPDATE SET
      created_at = EXCLUDED.created_at,
      payment_method = EXCLUDED.payment_method,
      payment_status = EXCLUDED.payment_status,
      customer_name = EXCLUDED.customer_name,
      customer_phone = EXCLUDED.customer_phone,
      total = EXCLUDED.total,
      payload = EXCLUDED.payload
  `;

  return {
    status: "saved",
    message: "Заказ сохранен в базе заказов.",
  };
}

async function listOrdersFromJsonl(limit: number): Promise<StoredOrder[]> {
  const content = await readFile(getOrderStorageFile(), "utf8");
  const orders = content
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as unknown;
      } catch {
        return null;
      }
    })
    .filter(isStoredOrder);

  return orders.reverse().slice(0, limit);
}

async function listOrdersFromDatabase(sql: SqlClient, limit: number): Promise<StoredOrder[]> {
  await ensureOrdersTable(sql);
  const rows = await sql`
    SELECT payload
    FROM orders
    ORDER BY created_at DESC
    LIMIT ${limit}
  ` as Array<{ payload: unknown }>;

  return rows.map((row) => row.payload).filter(isStoredOrder);
}

export async function saveOrder(order: StoredOrder): Promise<OrderStorageResult> {
  const useDatabase = Boolean(getDatabaseUrl());

  try {
    const sql = getDbClient();
    return sql ? await saveOrderToDatabase(sql, order) : await saveOrderToJsonl(order);
  } catch {
    return {
      status: "failed",
      message: useDatabase
        ? "Заказ создан, но база заказов сейчас недоступна."
        : "Заказ создан, но локальный журнал заявок сейчас недоступен.",
    };
  }
}

export async function listOrders(limit = 50): Promise<StoredOrder[]> {
  const useDatabase = Boolean(getDatabaseUrl());

  try {
    const sql = getDbClient();
    return sql ? await listOrdersFromDatabase(sql, limit) : await listOrdersFromJsonl(limit);
  } catch (error) {
    if (!useDatabase && error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw new Error("Order storage is unavailable.");
  }
}
