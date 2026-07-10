import { neon } from "@neondatabase/serverless";
import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";

export type StoredPaymentMethod = "invoice" | "online_yookassa";
export type StoredPaymentStatus =
  | "invoice_requested"
  | "yookassa_draft"
  | "yookassa_config_missing"
  | "yookassa_pending"
  | "yookassa_waiting_for_capture"
  | "yookassa_succeeded"
  | "yookassa_canceled"
  | "yookassa_failed";

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

export type StoredOnlinePayment = {
  provider: "yookassa";
  status: "created" | "config_missing" | "pending" | "waiting_for_capture" | "succeeded" | "canceled" | "failed";
  paymentId?: string;
  paymentStatus?: string;
  confirmationUrl?: string;
  event?: string;
  paid?: boolean;
  updatedAt?: string;
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
  onlinePayment?: StoredOnlinePayment;
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

export type OrderPaymentUpdate = {
  orderId?: string;
  paymentId: string;
  paymentStatus: string;
  event: string;
  paid?: boolean;
};

export type OrderPaymentUpdateResult = {
  status: "updated" | "not_found" | "failed";
  message: string;
  order?: StoredOrder;
};

type StoredOrderPaymentUpdateRecord = {
  schemaVersion: "order-payment-update/v0";
  orderId?: string;
  paymentId: string;
  paymentStatus: string;
  event: string;
  paid?: boolean;
  updatedAt: string;
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

function isOrderPaymentUpdateRecord(value: unknown): value is StoredOrderPaymentUpdateRecord {
  if (!value || typeof value !== "object") return false;

  const record = value as Partial<StoredOrderPaymentUpdateRecord>;
  return (
    record.schemaVersion === "order-payment-update/v0" &&
    typeof record.paymentId === "string" &&
    typeof record.paymentStatus === "string" &&
    typeof record.event === "string" &&
    typeof record.updatedAt === "string"
  );
}

function mapYooKassaPaymentStatus(status: string): StoredPaymentStatus {
  if (status === "pending") return "yookassa_pending";
  if (status === "waiting_for_capture") return "yookassa_waiting_for_capture";
  if (status === "succeeded") return "yookassa_succeeded";
  if (status === "canceled") return "yookassa_canceled";

  return "yookassa_failed";
}

function mapOnlinePaymentStatus(status: string): StoredOnlinePayment["status"] {
  if (status === "pending") return "pending";
  if (status === "waiting_for_capture") return "waiting_for_capture";
  if (status === "succeeded") return "succeeded";
  if (status === "canceled") return "canceled";

  return "failed";
}

function makePaymentMessage(status: string) {
  if (status === "succeeded") return "Платеж ЮKassa успешно оплачен.";
  if (status === "waiting_for_capture") return "Платеж ЮKassa ожидает подтверждения списания.";
  if (status === "canceled") return "Платеж ЮKassa отменен.";
  if (status === "pending") return "Платеж ЮKassa ожидает оплаты.";

  return "Статус платежа ЮKassa обновлен.";
}

function applyPaymentUpdate(order: StoredOrder, update: StoredOrderPaymentUpdateRecord): StoredOrder {
  return {
    ...order,
    paymentStatus: mapYooKassaPaymentStatus(update.paymentStatus),
    paymentMessage: makePaymentMessage(update.paymentStatus),
    onlinePayment: {
      provider: "yookassa",
      ...order.onlinePayment,
      status: mapOnlinePaymentStatus(update.paymentStatus),
      paymentId: update.paymentId,
      paymentStatus: update.paymentStatus,
      event: update.event,
      paid: update.paid,
      updatedAt: update.updatedAt,
      message: makePaymentMessage(update.paymentStatus),
    },
  };
}

function applyPaymentUpdateToOrders(
  orders: Map<string, StoredOrder>,
  paymentIndex: Map<string, string>,
  update: StoredOrderPaymentUpdateRecord
) {
  const orderId = update.orderId || paymentIndex.get(update.paymentId);
  if (!orderId) return;

  const order = orders.get(orderId);
  if (!order) return;

  const updatedOrder = applyPaymentUpdate(order, update);
  orders.set(orderId, updatedOrder);

  if (updatedOrder.onlinePayment?.paymentId) {
    paymentIndex.set(updatedOrder.onlinePayment.paymentId, updatedOrder.id);
  }
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
  const orders = new Map<string, StoredOrder>();
  const paymentIndex = new Map<string, string>();

  content
    .split("\n")
    .filter(Boolean)
    .forEach((line) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(line) as unknown;
      } catch {
        return;
      }

      if (isStoredOrder(parsed)) {
        orders.set(parsed.id, parsed);
        if (parsed.onlinePayment?.paymentId) {
          paymentIndex.set(parsed.onlinePayment.paymentId, parsed.id);
        }
        return;
      }

      if (isOrderPaymentUpdateRecord(parsed)) {
        applyPaymentUpdateToOrders(orders, paymentIndex, parsed);
      }
    });

  return Array.from(orders.values())
    .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
    .slice(0, limit);
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

async function findJsonlOrderForPayment(update: StoredOrderPaymentUpdateRecord): Promise<StoredOrder | null> {
  const orders = await listOrdersFromJsonl(Number.MAX_SAFE_INTEGER);

  return (
    orders.find((order) => order.id === update.orderId) ??
    orders.find((order) => order.onlinePayment?.paymentId === update.paymentId) ??
    null
  );
}

async function updateOrderPaymentInJsonl(update: StoredOrderPaymentUpdateRecord): Promise<OrderPaymentUpdateResult> {
  const order = await findJsonlOrderForPayment(update);
  if (!order) {
    return {
      status: "not_found",
      message: "Заказ для платежа ЮKassa не найден.",
    };
  }

  const updateWithOrderId = { ...update, orderId: order.id };
  const dir = getOrderStorageDir();
  await mkdir(dir, { recursive: true });
  await appendFile(getOrderStorageFile(), `${JSON.stringify(updateWithOrderId)}\n`, "utf8");

  return {
    status: "updated",
    message: "Статус платежа ЮKassa обновлен.",
    order: applyPaymentUpdate(order, updateWithOrderId),
  };
}

async function updateOrderPaymentInDatabase(
  sql: SqlClient,
  update: StoredOrderPaymentUpdateRecord
): Promise<OrderPaymentUpdateResult> {
  await ensureOrdersTable(sql);
  const rows = await sql`
    SELECT payload
    FROM orders
    WHERE id = ${update.orderId ?? ""} OR payload->'onlinePayment'->>'paymentId' = ${update.paymentId}
    ORDER BY created_at DESC
    LIMIT 1
  ` as Array<{ payload: unknown }>;

  const order = rows.map((row) => row.payload).find(isStoredOrder);
  if (!order) {
    return {
      status: "not_found",
      message: "Заказ для платежа ЮKassa не найден.",
    };
  }

  const updatedOrder = applyPaymentUpdate(order, { ...update, orderId: order.id });
  await sql`
    UPDATE orders
    SET
      payment_status = ${updatedOrder.paymentStatus},
      payload = ${JSON.stringify(updatedOrder)}::jsonb
    WHERE id = ${updatedOrder.id}
  `;

  return {
    status: "updated",
    message: "Статус платежа ЮKassa обновлен.",
    order: updatedOrder,
  };
}

export async function updateOrderPayment(update: OrderPaymentUpdate): Promise<OrderPaymentUpdateResult> {
  const useDatabase = Boolean(getDatabaseUrl());
  const updateRecord: StoredOrderPaymentUpdateRecord = {
    schemaVersion: "order-payment-update/v0",
    orderId: update.orderId,
    paymentId: update.paymentId,
    paymentStatus: update.paymentStatus,
    event: update.event,
    paid: update.paid,
    updatedAt: new Date().toISOString(),
  };

  try {
    const sql = getDbClient();
    return sql ? await updateOrderPaymentInDatabase(sql, updateRecord) : await updateOrderPaymentInJsonl(updateRecord);
  } catch {
    return {
      status: "failed",
      message: useDatabase
        ? "Статус платежа не обновлен: база заказов сейчас недоступна."
        : "Статус платежа не обновлен: локальный журнал заявок сейчас недоступен.",
    };
  }
}
