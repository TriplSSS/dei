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

function getOrderStorageDir() {
  return process.env.ORDER_STORAGE_DIR?.trim() || path.join(process.cwd(), ".data");
}

function getOrderStorageFile() {
  return path.join(getOrderStorageDir(), ORDER_FILE_NAME);
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

export async function saveOrder(order: StoredOrder): Promise<OrderStorageResult> {
  try {
    const dir = getOrderStorageDir();
    await mkdir(dir, { recursive: true });
    await appendFile(getOrderStorageFile(), `${JSON.stringify(order)}\n`, "utf8");

    return {
      status: "saved",
      message: "Заказ сохранен в журнале заявок.",
    };
  } catch {
    return {
      status: "failed",
      message: "Заказ создан, но локальный журнал заявок сейчас недоступен.",
    };
  }
}

export async function listOrders(limit = 50): Promise<StoredOrder[]> {
  try {
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
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}
