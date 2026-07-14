"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import PageHeader from "@/components/PageHeader";

const ruble = (n: number) => n.toLocaleString("ru-RU") + " ₽";

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
  paymentMethod: "invoice";
  paymentLabel: string;
  paymentStatus: "invoice_requested";
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
  const [order, setOrder] = useState<CreatedOrder | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = Boolean(form.name.trim() && form.phone.trim() && items.length > 0);

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
          paymentMethod: "invoice",
          items: items.map((item) => ({ slug: item.slug, qty: item.qty })),
        }),
      });

      const data = (await response.json().catch(() => null)) as OrderResponse | null;

      if (!data) {
        throw new Error("Не удалось отправить заявку. Попробуйте ещё раз.");
      }

      if (!data.ok) {
        throw new Error(data.message || "Не удалось отправить заявку. Попробуйте ещё раз.");
      }

      if (!response.ok) {
        throw new Error("Не удалось отправить заявку. Попробуйте ещё раз.");
      }

      setOrder(data.order);
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  };

  if (order) {
    return (
      <section className="checkout-success-page-v11">
        <div className="checkout-success-v11" aria-live="polite">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-white/10">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-400">
            Заявка отправлена
          </p>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Заявка принята в обработку</h1>
          <p className="mx-auto mt-3 max-w-[480px] text-sm leading-relaxed text-zinc-400">
            Мы зафиксировали состав заявки. Менеджер уточнит задачу, проверит наличие, итоговую стоимость и сроки поставки.
          </p>

          <div className="mt-8 border border-white/[0.08] bg-black/20 p-4 text-left">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs text-zinc-500">Номер заявки</p>
                <p className="mt-1 break-all text-lg font-bold text-white">{order.id}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-zinc-500">Сумма ориентировочно</p>
                <p className="mt-1 text-lg font-bold tabular-nums text-red-400">{ruble(order.total)}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-2">
              <Info label="Позиции" value={`${order.count} шт.`} />
              <Info label="Формат" value="Заявка менеджеру" />
            </div>
          </div>

          <div className="mt-5 border border-emerald-500/20 bg-emerald-500/10 p-4 text-left">
            <p className="text-sm font-semibold text-emerald-300">Что будет дальше</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{order.paymentMessage}</p>
          </div>

          <div className="mt-5 border border-white/[0.08] bg-black/20 p-4 text-left">
            <p className="text-sm font-semibold text-zinc-200">
              {order.notification.status === "sent" ? "Менеджер уведомлен" : "Уведомление менеджеру"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{order.notification.message}</p>
          </div>

          <div className={`mt-5 border p-4 text-left ${order.storage.status === "saved" ? "border-white/[0.08] bg-black/20" : "border-amber-500/25 bg-amber-500/10"}`}>
            <p className={`text-sm font-semibold ${order.storage.status === "saved" ? "text-zinc-200" : "text-amber-200"}`}>
              {order.storage.status === "saved" ? "Заявка сохранена" : "Журнал заявок недоступен"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{order.storage.message}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/catalog" className="btn bg-red-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500">
              Вернуться в каталог
            </Link>
            <Link href="/contacts" className="btn border border-white/10 px-7 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-white/20 hover:text-white">
              Связаться с DEI
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="internal-page-v11 checkout-page-v11">
      <PageHeader
        centered
        eyebrow="Заявка инженеру"
        title="Получите предложение по вашей задаче"
        description="Проверьте выбранное оборудование и оставьте контакты. Менеджер уточнит детали, комплектацию, стоимость и сроки — без регистрации и онлайн-оплаты."
      />
      <div className="internal-shell-v11 checkout-content-v11">
        <nav className="checkout-breadcrumbs-v11">
          <Link href="/catalog" className="transition-colors hover:text-zinc-400">Каталог</Link>
          <span>/</span>
          <span className="text-zinc-400">Заявка на подбор</span>
        </nav>

        <ol className="checkout-steps-v11" aria-label="Этапы отправки заявки">
            <li className="is-complete"><span>01</span> Оборудование</li>
            <li className="is-active" aria-current="step"><span>02</span> Контакты</li>
            <li><span>03</span> Ответ инженера</li>
        </ol>

        {items.length === 0 ? (
          <div className="checkout-empty py-20 text-center">
            <p className="text-zinc-500">Корзина пуста</p>
            <Link href="/catalog" className="mt-3 inline-block text-sm text-red-500 hover:text-red-400 transition-colors">
              Перейти в каталог →
            </Link>
          </div>
        ) : (
          <div className="checkout-layout-v11">
            <form onSubmit={submit} className="checkout-form-v11" aria-busy={busy}>
              <div className="checkout-request-note-v11">
                <span aria-hidden="true">01</span>
                <div><strong>Это заявка, а не онлайн-покупка</strong><p>Оплата на сайте временно не используется. Специалист DEI свяжется с вами, уточнит задачу и подготовит персональное предложение.</p></div>
              </div>

              <section className="checkout-v10__section">
                <div className="checkout-v10__section-head"><span>02</span><h2>Контактные данные</h2></div>
                <div className="grid gap-5 sm:grid-cols-2">
                <Field id="checkout-name" label="Контактное лицо *" value={form.name} onChange={set("name")} placeholder="Иван Петров" autoComplete="name" required />
                <Field id="checkout-phone" label="Телефон *" value={form.phone} onChange={set("phone")} placeholder="+7 (___) ___-__-__" type="tel" autoComplete="tel" required />
                <Field id="checkout-company" label="Организация" value={form.company} onChange={set("company")} placeholder="ООО «Ромашка»" autoComplete="organization" />
                <Field id="checkout-inn" label="ИНН" value={form.inn} onChange={set("inn")} placeholder="Для коммерческого предложения" autoComplete="off" />
                <div className="sm:col-span-2">
                  <Field id="checkout-email" label="Email" value={form.email} onChange={set("email")} placeholder="mail@company.ru" type="email" autoComplete="email" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-comment" className="mb-1.5 block text-xs font-medium text-zinc-400">Комментарий</label>
                  <textarea
                    id="checkout-comment"
                    value={form.comment}
                    onChange={set("comment")}
                    rows={3}
                    autoComplete="street-address"
                    placeholder="Сроки, адрес доставки, пожелания..."
                    className="dei-control w-full resize-none px-4 py-3 text-sm"
                  />
                </div>
                </div>
              </section>

              {error && (
                <div className="border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
                  {error}
                </div>
              )}

              <p className="text-[11px] leading-relaxed text-zinc-600">
                Отправляя заявку, вы соглашаетесь на обработку персональных данных. Это не является оплатой или окончательным заказом.
              </p>

              <button
                type="submit"
                disabled={!valid || busy}
                className="btn bg-red-600 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Отправляем заявку..." : "Отправить заявку инженеру"}
              </button>
            </form>

            <aside className="checkout-summary-v11">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Выбранное оборудование</p>
              <div className="flex flex-col gap-3">
                {items.map((it, index) => (
                  <div key={it.slug} className="flex gap-3">
                    <Image src={it.img} alt={it.name} width={48} height={48} loading={index === 0 ? "eager" : "lazy"} className="h-12 w-12 shrink-0 object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-zinc-200">{it.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center rounded-md border border-white/[0.08]">
                          <button type="button" onClick={() => setQty(it.slug, it.qty - 1)} className="h-6 w-6 text-zinc-400 hover:text-white btn" aria-label={`Уменьшить количество ${it.name}`}>−</button>
                          <span className="w-6 text-center text-xs tabular-nums text-white">{it.qty}</span>
                          <button type="button" onClick={() => setQty(it.slug, it.qty + 1)} className="h-6 w-6 text-zinc-400 hover:text-white btn" aria-label={`Увеличить количество ${it.name}`}>+</button>
                        </div>
                        <button type="button" onClick={() => remove(it.slug)} className="text-[11px] text-zinc-600 hover:text-red-400" aria-label={`Убрать ${it.name} из заявки`}>убрать</button>
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
                  Сумма ориентировочная. Менеджер подтвердит стоимость и комплектацию после уточнения задачи.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
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
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="dei-control px-4 py-3 text-sm"
      />
    </div>
  );
}
