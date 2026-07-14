"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/context/CartContext";

const ruble = (n: number) => n.toLocaleString("ru-RU") + " ₽";

export default function CartDrawer() {
  const { items, count, total, setQty, remove, isOpen, close } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* затемнение */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />

          {/* панель */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="cart-glass fixed right-0 top-0 z-[61] flex h-dvh w-full max-w-[440px] flex-col border-l border-white/[0.1]"
          >
            {/* шапка */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-semibold tracking-tight text-white">Корзина</h2>
                {count > 0 && (
                  <span className="text-xs font-semibold text-zinc-500 tabular-nums">{count} шт.</span>
                )}
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Закрыть"
                className="glass-pill btn flex h-9 w-9 items-center justify-center text-zinc-400 hover:border-white/20 hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {items.length === 0 ? (
              /* пусто */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center border border-white/10">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-500">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </div>
                <p className="text-zinc-400">Корзина пуста</p>
                <Link href="/catalog" onClick={close} className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors">
                  Перейти в каталог →
                </Link>
              </div>
            ) : (
              <>
                {/* список */}
                <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                  {items.map((it) => (
                    <div key={it.slug} className="glass-inner flex gap-3 p-3">
                      <Link href={`/catalog/${it.slug}`} onClick={close} className="shrink-0">
                        <Image src={it.img} alt={it.name} width={64} height={64} className="h-16 w-16 object-cover" />
                      </Link>
                      <div className="flex flex-1 flex-col min-w-0">
                        <Link href={`/catalog/${it.slug}`} onClick={close} className="text-sm font-medium text-zinc-100 hover:text-white leading-snug line-clamp-2">
                          {it.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-zinc-500">{it.price}</p>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          {/* количество */}
                          <div className="flex items-center border border-white/[0.08]">
                            <button
                              type="button"
                              onClick={() => setQty(it.slug, it.qty - 1)}
                              className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white btn"
                              aria-label="Меньше"
                            >
                              −
                            </button>
                            <span className="w-7 text-center text-sm tabular-nums text-white">{it.qty}</span>
                            <button
                              type="button"
                              onClick={() => setQty(it.slug, it.qty + 1)}
                              className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white btn"
                              aria-label="Больше"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(it.slug)}
                            className="text-xs text-zinc-600 hover:text-red-400 transition-colors"
                          >
                            Убрать
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* итог */}
                <div className="border-t border-white/[0.06] px-6 py-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-zinc-400">Позиций</span>
                    <span className="text-sm text-zinc-300 tabular-nums">{count} шт.</span>
                  </div>
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-sm text-zinc-400">Ориентировочно</span>
                    <span className="text-xl font-extrabold text-white tabular-nums">{ruble(total)}</span>
                  </div>
                  <p className="mb-4 text-[11px] leading-relaxed text-zinc-600">
                    Цены ориентировочные. Точную стоимость и счёт пришлём после подтверждения заявки.
                  </p>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="energy-strip btn block w-full bg-red-600 py-3.5 text-center font-semibold text-white transition-colors hover:bg-red-500"
                  >
                    Оформить заявку на счёт
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
