"use client";

import { useCart } from "@/context/CartContext";

export default function CartButton() {
  const { count, open } = useCart();
  return (
    <button
      onClick={open}
      aria-label={`Корзина, ${count} шт.`}
      className="relative w-9 h-9 flex items-center justify-center rounded-full glass-pill text-zinc-300 hover:text-white btn transition-colors"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-600 text-white text-[10px] font-bold tabular-nums leading-none">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
