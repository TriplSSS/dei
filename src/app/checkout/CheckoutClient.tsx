"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const ruble = (n: number) => n.toLocaleString("ru-RU") + " ₽";

type PaymentMethod = "invoice" | "online_yookassa";

type Form = {
  name: string;
  company: string;
  inn: string;
  phone: string;
  email: string;
  comment: string;
};

type CreatedOrder = {
  id: string;
  paymentMethod: PaymentMethod;
  paymentLabel: string;
  paymentStatus: "invoice_requested" | "yookassa_draft";
  paymentMessage: string;
  notification: {
    status: "sent" | "skipped_config_missing" | "failed";
    message: string;
  };
  storage: {
    status: "saved" | "failed";
    message: string;
  };
  count: number;
  total: number;
  items: {
    slug: string;
    name: string;
    price: string;
    priceNum: number;
    qty: number;
    lineTotal: number;
  }[];
};

type OrderResponse =
  | { ok: true; order: CreatedOrder }
  | { ok: false; message?: string };

export default function CheckoutClient() {
  const { items, count, total, setQty, remove, clear } = useCart();
  const [form, setForm] = useState<Form>({ name: "", company: "", inn: "", phone: "", email: "", comment: "" });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("invoice");
  const [order, setOrder] = useState<CreatedOrder | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = Boolean(form.name.trim() && form.phone.trim() && items.length > 0);
  const submitLabel = paymentMethod === "invoice" ? "Создать заявку на счет" : "Создать заказ для онлайн-оплаты";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;

    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          paymentMethod,
          items: items.map((item) => ({ slug: item.slug, qty: item.qty })),
        }),
      });

      const data = (await response.json().catch(() => null)) as OrderResponse | null;

      if (!data) {
        throw new Error("Не удалось создать заказ. Попробуйте еще раз.");
      }

      if (!data.ok) {
        throw new Error(data.message || "Не удалось создать заказ. Попробуйте еще раз.");
      }

      if (!response.ok) {
        throw new Error("Не удалось создать заказ. Попробуйте еще раз.");
      }

      setOrder(data.order);
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось создать заказ. Попробуйте еще раз.");
    } finally {
      setBusy(false);
    }
  };

  if (order) {
    const isInvoice = order.paymentMethod === "invoice";

    return (
      <section className="px-6 pt-36 pb-28">
        <div className="mx-auto max-w-[680px] glass-card rounded-2xl p-6 text-center md:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400">
            Заказ создан
          </p>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Заявка принята в обработку</h1>
          <p className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed text-zinc-400">
            Мы зафиксировали состав заказа и выбранный способ оплаты. Менеджер проверит наличие, итоговую стоимость и сроки поставки.
          </p>

          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-black/20 p-4 text-left">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs text-zinc-500">Номер заказа</p>
                <p className="mt-1 break-all text-lg font-bold text-white">{order.id}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-zinc-500">Сумма ориентировочно</p>
                <p className="mt-1 text-lg font-bold tabular-nums text-red-400">{ruble(order.total)}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-2">
              <Info label="Позиции" value={`${order.count} шт.`} />
              <Info label="Оплата" value={order.paymentLabel} />
            </div>
          </div>

          <div className={`mt-5 rounded-2xl border p-4 text-left ${isInvoice ? "border-emerald-500/20 bg-emerald-500/10" : "border-red-500/20 bg-red-500/10"}`}>
            <p className={`text-sm font-semibold ${isInvoice ? "text-emerald-300" : "text-red-300"}`}>
              {isInvoice ? "Счет на оплату" : "ЮKassa подготовлена"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{order.paymentMessage}</p>
          </div>

          <div className="mt-5 rounded-2xl border border-white/[0.08] bg-black/20 p-4 text-left">
            <p className="text-sm font-semibold text-zinc-200">
              {order.notification.status === "sent" ? "Менеджер уведомлен" : "Уведомление менеджеру"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{order.notification.message}</p>
          </div>

          <div className={`mt-5 rounded-2xl border p-4 text-left ${order.storage.status === "saved" ? "border-white/[0.08] bg-black/20" : "border-amber-500/25 bg-amber-500/10"}`}>
            <p className={`text-sm font-semibold ${order.storage.status === "saved" ? "text-zinc-200" : "text-amber-200"}`}>
              {order.storage.status === "saved" ? "Заявка сохранена" : "Журнал заявок недоступен"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{order.storage.message}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/catalog" className="rounded-xl bg-red-600 px-7 py-3 text-sm font-semibold text-white btn transition-colors hover:bg-red-500">
              Вернуться в каталог
            </Link>
            <Link href="/contacts" className="glass-pill rounded-xl px-7 py-3 text-sm font-semibold text-zinc-300 btn transition-colors hover:text-white">
              Связаться с DEI
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 pt-36 pb-24">
      <div className="mx-auto max-w-[1100px]">
        <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-600">
          <Link href="/catalog" className="transition-colors hover:text-zinc-400">Каталог</Link>
          <span>/</span>
          <span className="text-zinc-400">Оформление заказа</span>
        </nav>

        <h1 className="mb-2 text-3xl md:text-4xl font-bold tracking-tight text-white">Оформление заказа</h1>
        <p className="mb-10 max-w-[640px] text-sm text-zinc-400">
          Выберите способ оплаты: счет для безналичной оплаты или подготовку онлайн-оплаты через ЮKassa. Платежи пока не списываются на сайте.
        </p>

        {items.length === 0 ? (
          <div className="glass-card rounded-2xl py-16 text-center">
            <p className="text-zinc-500">Корзина пуста</p>
            <Link href="/catalog" className="mt-3 inline-block text-sm text-red-500 hover:text-red-400 transition-colors">
              Перейти в каталог →
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] items-start">
            <form onSubmit={submit} className="flex flex-col gap-5 glass-card rounded-2xl p-6 md:p-8">
              <div>
                <p className="mb-2 block text-xs font-medium text-zinc-400">Способ оплаты *</p>
                <div className="grid gap-1 rounded-xl border border-white/[0.08] bg-black/20 p-1 sm:grid-cols-2">
                  <PaymentButton
                    active={paymentMethod === "invoice"}
                    title="Счет на оплату"
                    description="Заявка уйдет менеджеру для подготовки счета."
                    onClick={() => setPaymentMethod("invoice")}
                  />
                  <PaymentButton
                    active={paymentMethod === "online_yookassa"}
                    title="Онлайн ЮKassa"
                    description="Пока без списания: только подготовка заказа."
                    onClick={() => setPaymentMethod("online_yookassa")}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Контактное лицо *" value={form.name} onChange={set("name")} placeholder="Иван Петров" />
                <Field label="Телефон *" value={form.phone} onChange={set("phone")} placeholder="+7 (___) ___-__-__" type="tel" />
                <Field label="Организация" value={form.company} onChange={set("company")} placeholder="ООО «Ромашка»" />
                <Field label="ИНН" value={form.inn} onChange={set("inn")} placeholder="Для выставления счета" />
                <div className="sm:col-span-2">
                  <Field label="Email" value={form.email} onChange={set("email")} placeholder="mail@company.ru" type="email" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">Комментарий</label>
                  <textarea
                    value={form.comment}
                    onChange={set("comment")}
                    rows={3}
                    placeholder="Сроки, адрес доставки, пожелания..."
                    className="w-full resize-none rounded-xl bg-black/20 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-red-600/40"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>
              </div>

              {paymentMethod === "online_yookassa" && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-zinc-300">
                  Онлайн-оплата через ЮKassa находится в подготовке. После отправки заказа платежная ссылка не создается автоматически.
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <p className="text-[11px] leading-relaxed text-zinc-600">
                Нажимая кнопку оформления, вы соглашаетесь на обработку персональных данных. Заказ создается на сервере, но без реального списания денег.
              </p>

              <button
                type="submit"
                disabled={!valid || busy}
                className="rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white btn transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_8px_28px_-6px_rgba(220,38,38,0.5)]"
              >
                {busy ? "Создаем заказ..." : submitLabel}
              </button>
            </form>

            <aside className="glass-card rounded-2xl p-6">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Ваш заказ</p>
              <div className="flex flex-col gap-3">
                {items.map((it) => (
                  <div key={it.slug} className="flex gap-3">
                    <img src={it.img} alt={it.name} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-zinc-200">{it.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center rounded-md border border-white/[0.08]">
                          <button type="button" onClick={() => setQty(it.slug, it.qty - 1)} className="h-6 w-6 text-zinc-400 hover:text-white btn">−</button>
                          <span className="w-6 text-center text-xs tabular-nums text-white">{it.qty}</span>
                          <button type="button" onClick={() => setQty(it.slug, it.qty + 1)} className="h-6 w-6 text-zinc-400 hover:text-white btn">+</button>
                        </div>
                        <button type="button" onClick={() => remove(it.slug)} className="text-[11px] text-zinc-600 hover:text-red-400">убрать</button>
                      </div>
                    </div>
                    <p className="shrink-0 text-sm tabular-nums text-zinc-300">{ruble(it.priceNum * it.qty)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-white/[0.06] pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">Итого ({count} шт.)</span>
                  <span className="text-lg font-extrabold tabular-nums text-white">{ruble(total)}</span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">
                  Сумма ориентировочная. Сервер пересчитает заказ по текущему каталогу перед созданием заявки.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

function PaymentButton({
  active,
  title,
  description,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-lg px-4 py-3 text-left transition-colors ${
        active ? "bg-red-600 text-white" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      <span className="block text-sm font-semibold">{title}</span>
      <span className={`mt-1 block text-xs leading-relaxed ${active ? "text-red-100" : "text-zinc-600"}`}>
        {description}
      </span>
    </button>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-200">{value}</p>
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
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl bg-black/20 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-red-600/40"
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      />
    </div>
  );
}
