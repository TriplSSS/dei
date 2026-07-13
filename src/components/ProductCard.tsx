"use client";

import Link from "next/link";
import Reveal from "./Reveal";

interface Product {
  name: string;
  category: string;
  price: string;
  img: string;
}

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <Reveal delay={index * 0.07} direction="blur">
      <div
        className="group glass-card flex cursor-default flex-col overflow-hidden rounded-lg"
        style={{
          transition:
            "box-shadow 220ms ease, border-color 220ms ease, background-color 220ms ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "rgba(220,38,38,0.35)";
          (e.currentTarget as HTMLDivElement).style.boxShadow =
            "0 0 0 1px rgba(220,38,38,0.15), 0 12px 32px -8px rgba(220,38,38,0.12), 0 12px 32px -8px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "rgba(255,255,255,0.07)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "";
        }}
      >
        {/* Картинка */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover img-zoom"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          {/* Категория поверх картинки */}
          <div className="absolute top-3 left-3">
            <span className="glass-pill rounded-md px-2.5 py-1 text-[10px] font-medium uppercase tracking-normal text-red-400">
              {product.category}
            </span>
          </div>
        </div>
        <div className="h-px bg-white/[0.06]" />

        <div className="glass-inner flex flex-1 flex-col gap-3 p-4">
          <h3 className="min-h-10 text-sm font-semibold leading-snug text-zinc-100 transition-colors duration-200 group-hover:text-white">
            {product.name}
          </h3>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.05] pt-3">
            <p className="text-base font-bold tabular-nums text-red-500">
              {product.price}
            </p>

            <Link
              href="/catalog"
              className="btn rounded-md border border-white/[0.08] px-3 py-1.5 text-xs text-zinc-300 transition-colors duration-200 hover:border-red-600/30 hover:text-white"
            >
              В каталог
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
