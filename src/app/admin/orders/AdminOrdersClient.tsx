"use client";

import { useState } from "react";

type AdminOrder = {
  id: string;
  createdAt: string;
  paymentLabel: string;
  paymentStatus:
    | "invoice_requested"
    | "yookassa_draft"
    | "yookassa_config_missing"
    | "yookassa_pending"
    | "yookassa_waiting_for_capture"
    | "yookassa_succeeded"
    | "yookassa_canceled"
    | "yookassa_failed";
  onlinePayment?: {
    provider: "yookassa";
    status: "created" | "config_missing" | "pending" | "waiting_for_capture" | "succeeded" | "canceled" | "failed";
    paymentId?: string;
    paymentStatus?: string;
    confirmationUrl?: string;
    message: string;
  };
  notification: {
    status: "sent" | "skipped_config_missing" | "failed";
    message: string;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
    company: string;
    inn: string;
    comment: string;
  };
  items: {
    slug: string;
    name: string;
    price: string;
    qty: number;
    lineTotal: number;
  }[];
  count: number;
  total: number;
};

type OrdersResponse =
  | { ok: true; orders: AdminOrder[]; count: number }
  | { ok: false; message?: string };

const ruble = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function paymentStatusLabel(status: AdminOrder["paymentStatus"]) {
  if (status === "invoice_requested") return "Счет запрошен";
  if (status === "yookassa_pending") return "ЮKassa ожидает оплаты";
  if (status === "yookassa_waiting_for_capture") return "ЮKassa ожидает списания";
  if (status === "yookassa_succeeded") return "ЮKassa оплачена";
  if (status === "yookassa_canceled") return "ЮKassa отменена";
  if (status === "yookassa_config_missing") return "ЮKassa не настроена";
  if (status === "yookassa_failed") return "ЮKassa ошибка";

  return "ЮKassa в подготовке";
}

function paymentStatusClass(status: AdminOrder["paymentStatus"]) {
  if (status === "invoice_requested") return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  if (status === "yookassa_pending") return "border-sky-500/20 bg-sky-500/10 text-sky-300";
  if (status === "yookassa_waiting_for_capture") return "border-amber-500/25 bg-amber-500/10 text-amber-200";
  if (status === "yookassa_succeeded") return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  if (status === "yookassa_canceled") return "border-red-500/25 bg-red-500/10 text-red-200";
  if (status === "yookassa_config_missing") return "border-amber-500/25 bg-amber-500/10 text-amber-200";
  if (status === "yookassa_failed") return "border-red-500/25 bg-red-500/10 text-red-200";

  return "border-white/[0.08] bg-white/[0.03] text-zinc-400";
}

function notificationLabel(status: AdminOrder["notification"]["status"]) {
  if (status === "sent") return "Email отправлен";
  if (status === "failed") return "Email не отправлен";

  return "Email не настроен";
}

function notificationClass(status: AdminOrder["notification"]["status"]) {
  if (status === "sent") return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  if (status === "failed") return "border-red-500/25 bg-red-500/10 text-red-200";

  return "border-amber-500/25 bg-amber-500/10 text-amber-200";
}

export default function AdminOrdersClient() {
  const [token, setToken] = useState("");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!token.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders?limit=50", {
        headers: {
          "x-admin-token": token.trim(),
        },
      });
      const data = (await response.json().catch(() => null)) as OrdersResponse | null;

      if (!data) {
        throw new Error("Не удалось прочитать список заказов.");
      }

      if (!data.ok) {
        throw new Error(data.message || "Доступ к заказам отклонен.");
      }

      if (!response.ok) {
        throw new Error("Доступ к заказам отклонен.");
      }

      setOrders(data.orders);
      setLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось прочитать список заказов.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dei-admin-page admin-orders-page px-4 pb-24 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <header className="admin-v10__header mb-8">
          <div>
            <p className="admin-v10__index">ADMIN / 02</p>
            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Заказы</h1>
            <p className="mt-3 max-w-[620px] text-sm leading-relaxed text-zinc-400">
              Внутренний список заявок из локального журнала заказов.
            </p>
          </div>

          <form onSubmit={loadOrders} className="admin-v10__auth">
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Пароль админки"
              autoComplete="current-password"
              className="min-h-11 rounded-xl border border-white/[0.08] bg-black/25 px-4 text-sm text-zinc-100 outline-none transition-colors placeholder:text-zinc-600 focus:border-red-600/50 sm:w-64"
            />
            <button
              type="submit"
              disabled={!token.trim() || loading}
              className="min-h-11 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white btn transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Загрузка..." : loaded ? "Обновить" : "Открыть"}
            </button>
          </form>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {loaded && orders.length === 0 && (
          <div className="admin-empty p-8 text-center text-sm text-zinc-500">
            Заказов пока нет.
          </div>
        )}

        <div className="admin-order-ledger">
          {orders.map((order) => (
            <article key={order.id} className="admin-order-card min-w-0 p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="min-w-0 break-all text-base font-bold text-white sm:text-lg">{order.id}</h2>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${paymentStatusClass(order.paymentStatus)}`}>
                      {paymentStatusLabel(order.paymentStatus)}
                    </span>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${notificationClass(order.notification.status)}`}>
                      {notificationLabel(order.notification.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">{formatDate(order.createdAt)}</p>
                </div>

                <div className="grid min-w-0 grid-cols-2 gap-3 text-sm sm:grid-cols-3 lg:min-w-[360px] lg:text-right">
                  <Info label="Оплата" value={order.paymentLabel} />
                  <Info label="Позиций" value={`${order.count} шт.`} />
                  <Info label="Сумма" value={ruble(order.total)} strong />
                </div>
              </div>

              <div className="mt-5 grid min-w-0 gap-5 border-t border-white/[0.06] pt-5 lg:grid-cols-[320px_minmax(0,1fr)]">
                <div className="min-w-0 text-sm">
                  <p className="font-semibold text-zinc-200">{order.customer.name}</p>
                  <p className="mt-1 text-zinc-400">{order.customer.phone}</p>
                  {order.customer.email && <p className="mt-1 break-all text-zinc-500">{order.customer.email}</p>}
                  {order.onlinePayment?.paymentId && (
                    <div className="mt-3 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 text-xs text-zinc-400">
                      <p>
                        <span className="text-zinc-500">ID платежа ЮKassa: </span>
                        <span className="break-all font-mono text-zinc-300">{order.onlinePayment.paymentId}</span>
                      </p>
                      {order.onlinePayment.paymentStatus && (
                        <p className="mt-1">
                          <span className="text-zinc-500">Статус платежа: </span>
                          <span className="text-zinc-300">{order.onlinePayment.paymentStatus}</span>
                        </p>
                      )}
                    </div>
                  )}
                  {order.customer.company && <p className="mt-3 text-zinc-400">{order.customer.company}</p>}
                  {order.customer.inn && <p className="mt-1 text-zinc-500">ИНН: {order.customer.inn}</p>}
                  {order.customer.comment && (
                    <p className="mt-3 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 text-zinc-400">
                      {order.customer.comment}
                    </p>
                  )}
                </div>

                <div className="min-w-0 overflow-x-auto rounded-lg border border-white/[0.06] bg-black/10">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-left text-xs uppercase tracking-[0.12em] text-zinc-600">
                        <th className="px-3 py-3 font-semibold">Товар</th>
                        <th className="px-3 py-3 text-center font-semibold">Кол-во</th>
                        <th className="px-3 py-3 text-right font-semibold">Сумма</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={`${order.id}-${item.slug}`} className="border-b border-white/[0.04] last:border-0">
                          <td className="px-3 py-3 text-zinc-200">{item.name}</td>
                          <td className="px-3 py-3 text-center tabular-nums text-zinc-400">{item.qty}</td>
                          <td className="px-3 py-3 text-right tabular-nums text-zinc-300">{ruble(item.lineTotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`mt-1 ${strong ? "font-bold text-red-400" : "font-semibold text-zinc-200"}`}>{value}</p>
    </div>
  );
}
