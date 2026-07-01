"use client";

import Reveal from "./Reveal";

interface Product {
  name: string;
  category: string;
  price: string;
  img: string;
}

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <div
        className="group glass-card hover-lift rounded-2xl overflow-hidden cursor-default flex flex-col"
        style={{
          transition:
            "transform 300ms cubic-bezier(0.22,1,0.36,1), box-shadow 300ms ease, border-color 300ms ease",
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
          <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/10 transition-colors duration-300" />
          {/* Категория поверх картинки */}
          <div className="absolute top-3 left-3">
            <span className="glass-pill rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-red-400">
              {product.category}
            </span>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />

        {/* Контент */}
        <div className="glass-inner flex flex-col gap-3 p-4 flex-1">
          <h3 className="font-semibold text-zinc-100 text-sm leading-snug group-hover:text-white transition-colors duration-200">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-auto pt-1">
            <p className="text-red-500 font-bold text-base tabular-nums">
              {product.price}
            </p>

            {/* Кнопка "Запросить" */}
            <a
              href="/contacts"
              className="btn glass-pill text-zinc-300 hover:text-white text-xs px-3 py-1.5 rounded-lg transition-colors duration-200"
            >
              Запросить
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
