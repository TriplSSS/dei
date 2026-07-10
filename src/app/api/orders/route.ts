import {
  listOrders,
  saveOrder,
  type StoredCustomer,
  type StoredNotification,
  type StoredOnlinePayment,
  type StoredOrder,
  type StoredOrderItem,
  type StoredPaymentMethod,
  type StoredPaymentStatus,
} from "@/lib/orderStorage";
import { listProducts } from "@/lib/productCatalog";
import { createYooKassaPayment } from "@/lib/yookassa";
import { timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

type PaymentMethod = StoredPaymentMethod;

type OrderItemInput = {
  slug?: unknown;
  qty?: unknown;
};

type OrderRequest = {
  customer?: {
    name?: unknown;
    company?: unknown;
    inn?: unknown;
    phone?: unknown;
    email?: unknown;
    comment?: unknown;
  };
  items?: OrderItemInput[];
  paymentMethod?: unknown;
};

type NormalizedOrderItem = StoredOrderItem;
type NormalizedCustomer = StoredCustomer;
type NotificationResult = StoredNotification;
type OnlinePaymentResult = StoredOnlinePayment;

const paymentLabels: Record<PaymentMethod, string> = {
  invoice: "Счет на оплату",
  online_yookassa: "Онлайн-оплата ЮKassa",
};

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === "invoice" || value === "online_yookassa";
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function makeOrderId() {
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DEI-${stamp}-${randomPart}`;
}

function jsonError(message: string, status = 400) {
  return Response.json({ ok: false, message }, { status });
}

function clampLimit(value: string | null) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) return 50;

  return Math.min(Math.max(parsed, 1), 100);
}

function secureEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function readProvidedAdminToken(request: Request) {
  const headerToken = request.headers.get("x-admin-token")?.trim();
  if (headerToken) return headerToken;

  const authHeader = request.headers.get("authorization")?.trim();
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  return "";
}

type AdminAuthResult =
  | { ok: true }
  | {
      ok: false;
      status: 401 | 503;
      message: string;
    };

function verifyAdminRequest(request: Request): AdminAuthResult {
  const expectedToken = process.env.ADMIN_ORDERS_TOKEN?.trim();

  if (!expectedToken) {
    return {
      ok: false,
      status: 503,
      message: "Админка заказов не настроена: задайте ADMIN_ORDERS_TOKEN.",
    };
  }

  const providedToken = readProvidedAdminToken(request);
  if (!providedToken || !secureEqual(providedToken, expectedToken)) {
    return {
      ok: false,
      status: 401,
      message: "Неверный пароль админки заказов.",
    };
  }

  return { ok: true };
}

function formatRuble(value: number) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCustomerLine(label: string, value: string) {
  return value ? `${label}: ${value}` : "";
}

function makeOrderText(params: {
  orderId: string;
  paymentLabel: string;
  customer: NormalizedCustomer;
  items: NormalizedOrderItem[];
  count: number;
  total: number;
}) {
  const itemLines = params.items
    .map((item) => `- ${item.name} x ${item.qty}: ${formatRuble(item.lineTotal)}`)
    .join("\n");

  return [
    `Новый заказ ${params.orderId}`,
    "",
    `Оплата: ${params.paymentLabel}`,
    `Позиций: ${params.count}`,
    `Сумма: ${formatRuble(params.total)}`,
    "",
    "Клиент:",
    formatCustomerLine("Имя", params.customer.name),
    formatCustomerLine("Телефон", params.customer.phone),
    formatCustomerLine("Email", params.customer.email),
    formatCustomerLine("Организация", params.customer.company),
    formatCustomerLine("ИНН", params.customer.inn),
    formatCustomerLine("Комментарий", params.customer.comment),
    "",
    "Товары:",
    itemLines,
  ].filter(Boolean).join("\n");
}

function makeOrderHtml(params: {
  orderId: string;
  paymentLabel: string;
  customer: NormalizedCustomer;
  items: NormalizedOrderItem[];
  count: number;
  total: number;
}) {
  const itemRows = params.items.map((item) => (
    `<tr>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.qty}</td>
      <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">${escapeHtml(formatRuble(item.lineTotal))}</td>
    </tr>`
  )).join("");

  const customerRows = [
    ["Имя", params.customer.name],
    ["Телефон", params.customer.phone],
    ["Email", params.customer.email],
    ["Организация", params.customer.company],
    ["ИНН", params.customer.inn],
    ["Комментарий", params.customer.comment],
  ].filter(([, value]) => value).map(([label, value]) => (
    `<p style="margin:4px 0;"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`
  )).join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5;">
      <h1 style="margin:0 0 16px;">Новый заказ ${escapeHtml(params.orderId)}</h1>
      <p><strong>Оплата:</strong> ${escapeHtml(params.paymentLabel)}</p>
      <p><strong>Позиций:</strong> ${params.count}</p>
      <p><strong>Сумма:</strong> ${escapeHtml(formatRuble(params.total))}</p>
      <h2 style="margin-top:24px;">Клиент</h2>
      ${customerRows}
      <h2 style="margin-top:24px;">Товары</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px;">
        <thead>
          <tr>
            <th style="padding:8px;text-align:left;border-bottom:2px solid #d1d5db;">Товар</th>
            <th style="padding:8px;text-align:center;border-bottom:2px solid #d1d5db;">Кол-во</th>
            <th style="padding:8px;text-align:right;border-bottom:2px solid #d1d5db;">Сумма</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
    </div>
  `;
}

async function notifyManager(params: {
  orderId: string;
  paymentLabel: string;
  customer: NormalizedCustomer;
  items: NormalizedOrderItem[];
  count: number;
  total: number;
}): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const notifyEmail = process.env.ORDER_NOTIFY_EMAIL?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim() || "DEI <onboarding@resend.dev>";

  if (!apiKey || !notifyEmail) {
    return {
      status: "skipped_config_missing",
      message: "Email-уведомление менеджеру не отправлено: переменные окружения не настроены.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [notifyEmail],
      subject: `Новый заказ DEI ${params.orderId}`,
      text: makeOrderText(params),
      html: makeOrderHtml(params),
    }),
  }).catch(() => undefined);

  if (!response?.ok) {
    return {
      status: "failed",
      message: "Заказ создан, но email-уведомление менеджеру не отправлено автоматически.",
    };
  }

  return {
    status: "sent",
    message: "Email-уведомление менеджеру отправлено.",
  };
}

function getPaymentMessage(paymentMethod: PaymentMethod, onlinePayment?: OnlinePaymentResult) {
  if (paymentMethod === "invoice") {
    return "Заявка на счет создана. Менеджер проверит позиции и подготовит счет на оплату.";
  }

  return onlinePayment?.message ?? "Заказ создан. Онлайн-оплата ЮKassa ожидает настройки.";
}

function getPaymentStatus(paymentMethod: PaymentMethod, onlinePayment?: OnlinePaymentResult): StoredPaymentStatus {
  if (paymentMethod === "invoice") return "invoice_requested";
  if (!onlinePayment) return "yookassa_draft";
  if (onlinePayment.status === "created") return "yookassa_pending";
  if (onlinePayment.status === "config_missing") return "yookassa_config_missing";
  return "yookassa_failed";
}

export async function GET(request: Request) {
  const auth = verifyAdminRequest(request);

  if (!auth.ok) {
    return jsonError(auth.message, auth.status);
  }

  const url = new URL(request.url);
  const limit = clampLimit(url.searchParams.get("limit"));
  const orders = await listOrders(limit);

  return Response.json({
    ok: true,
    orders,
    count: orders.length,
  });
}

export async function POST(request: Request) {
  let body: OrderRequest;

  try {
    body = await request.json();
  } catch {
    return jsonError("Некорректный формат заявки.");
  }

  const customer = body.customer ?? {};
  const name = normalizeText(customer.name);
  const phone = normalizeText(customer.phone);
  const email = normalizeText(customer.email);
  const paymentMethod = body.paymentMethod;

  if (!name || !phone) {
    return jsonError("Укажите контактное лицо и телефон.");
  }

  if (!isPaymentMethod(paymentMethod)) {
    return jsonError("Выберите способ оплаты.");
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return jsonError("Корзина пуста.");
  }

  const products = await listProducts();
  const items = body.items.map((item): NormalizedOrderItem | null => {
    const slug = normalizeText(item.slug);
    const qty = Number(item.qty);
    const product = products.find((p) => p.slug === slug);

    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 999) {
      return null;
    }

    return {
      slug: product.slug,
      name: product.name,
      price: product.price,
      priceNum: product.priceNum,
      qty,
      lineTotal: product.priceNum * qty,
    };
  });

  if (items.some((item) => item === null)) {
    return jsonError("В заявке есть недоступные товары или некорректное количество.");
  }

  const normalizedItems = items.filter((item): item is NormalizedOrderItem => item !== null);
  const total = normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const count = normalizedItems.reduce((sum, item) => sum + item.qty, 0);
  const orderId = makeOrderId();
  const normalizedCustomer: NormalizedCustomer = {
    name,
    phone,
    email,
    company: normalizeText(customer.company),
    inn: normalizeText(customer.inn),
    comment: normalizeText(customer.comment),
  };
  const paymentLabel = paymentLabels[paymentMethod];
  const onlinePayment: OnlinePaymentResult | undefined =
    paymentMethod === "online_yookassa"
      ? await createYooKassaPayment({
          orderId,
          total,
          description: `Заказ DEI ${orderId}`,
        })
      : undefined;
  const paymentStatus = getPaymentStatus(paymentMethod, onlinePayment);
  const paymentMessage = getPaymentMessage(paymentMethod, onlinePayment);
  const notification = await notifyManager({
    orderId,
    paymentLabel,
    customer: normalizedCustomer,
    items: normalizedItems,
    count,
    total,
  });
  const order: StoredOrder = {
    schemaVersion: "order/v0",
    id: orderId,
    createdAt: new Date().toISOString(),
    status: "created",
    paymentMethod,
    paymentLabel,
    paymentStatus,
    paymentMessage,
    onlinePayment,
    notification,
    customer: normalizedCustomer,
    items: normalizedItems,
    count,
    total,
  };
  const storage = await saveOrder(order);

  return Response.json(
    {
      ok: true,
      order: {
        ...order,
        storage,
      },
    },
    { status: 201 }
  );
}
