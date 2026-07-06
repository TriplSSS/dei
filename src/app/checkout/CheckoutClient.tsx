"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const ruble = (n: number) => n.toLocaleString("ru-RU") + " ₽";

type Form = {
  name: string;
  company: string;
  inn: string;
  phone: string;
  email: string;
  comment: string;
};

export default function CheckoutClient() {
  const { items, count, total, setQty, remove, clear } = useCart();
  const [form, setForm] = useState<Form>({ name: "", company: "", inn: "", phone: "", email: "", comment: "" });
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = form.name.trim() && form.phone.trim() && (form.email.trim() || form.phone.trim());

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || items.length === 0) return;
    setBusy(true);
    // Отправка заявки на бэкенд появится на Этапе 3 (email через Resend).
    // Пока — оформляем заявку локально и показываем подтверждение.
    await new Promise((r) => setTimeout(r, 600));
    setBusy(false);
    setSent(true);
    clear();
  };

  if (sent) {
    return (
      <section className="px-6 pt-36 pb-28">
        <div className="mx-auto max-w-[560px] glass-card rounded-2xl p-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Заявка принята</h1>
          <p className="mx-auto mt-3 max-w-[400px] text-sm leading-relaxed text-zinc-400">
            Мы подготовим счёт и свяжемся с вами в рабочее время (Пн–Пт 9:00–18:00) по указанным контактам.
          </p>
          <Link href="/catalog" className="mt-8 inline-block rounded-xl bg-red-600 px-7 py-3 text-sm font-semibold text-white btn transition-colors hover:bg-red-500">
            Вернуться в каталог
          </Link>
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
          <span className="text-zinc-400">Оформление заявки</span>
        </nav>

        <h1 className="mb-2 text-3xl md:text-4xl font-bold tracking-tight text-white">Оформление заявки на счёт</h1>
        <p className="mb-10 max-w-[560px] text-sm text-zinc-400">
          Оплата по безналичному расчёту. Пришлём счёт на реквизиты и согласуем сроки поставки.
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
            {/* Форма */}
            <form onSubmit={submit} className="flex flex-col gap-5 glass-card rounded-2xl p-6 md:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Контактное лицо *" value={form.name} onChange={set("name")} placeholder="Иван Петров" />
                <Field label="Телефон *" value={form.phone} onChange={set("phone")} placeholder="+7 (___) ___-__-__" type="tel" />
                <Field label="Организация" value={form.company} onChange={set("company")} placeholder="ООО «Ромашка»" />
                <Field label="ИНН" value={form.inn} onChange={set("inn")} placeholder="Для выставления счёта" />
                <div className="sm:col-span-2">
                  <Field label="Email" value={form.email} onChange={set("email")} placeholder="mail@company.ru" type="email" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-zinc-400">Комментарий</label>
                  <textarea
                    value={form.comment}
                    onChange={set("comment")}
                    rows={3}
                    placeholder="Сроки, адрес доставки, пожелания…"
                    className="w-full resize-none rounded-xl bg-black/20 px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-red-600/40"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-zinc-600">
                Нажимая «Отправить заявку», вы соглашаетесь на обработку персональных данных. Оплата картой на сайте не производится — счёт выставляется по безналичному расчёту.
              </p>

              <button
                type="submit"
                disabled={!valid || busy}
                className="rounded-xl bg-red-600 py-3.5 text-sm font-semibold text-white btn transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_8px_28px_-6px_rgba(220,38,38,0.5)]"
              >
                {busy ? "Отправляем…" : "Отправить заявку"}
              </button>
            </form>

            {/* Сводка заказа */}
            <aside className="glass-card rounded-2xl p-6">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Ваша заявка</p>
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
                  Сумма ориентировочная. Точную стоимость укажем в счёте.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
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
