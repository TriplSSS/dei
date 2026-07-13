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
        className="product-card-premium group glass-card flex cursor-default flex-col overflow-hidden rounded-lg"
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
        <div className="product-photo-stage relative aspect-[4/3] overflow-hidden">
          <img
            src={product.img}
            alt={product.name}
            className="product-photo-blend relative h-full w-full img-zoom"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(9,9,11,0.62),transparent_58%)] transition-colors duration-300" />
          <div className="absolute top-3 left-3">
            <span className="glass-pill inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-medium uppercase tracking-normal text-red-300">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.85)]" />
              {product.category}
            </span>
          </div>
          <div className="absolute bottom-3 right-3 rounded-md border border-white/[0.08] bg-black/30 px-2 py-1 text-[10px] font-medium text-zinc-300 backdrop-blur-md">
            В наличии / под заказ
          </div>
        </div>
        <div className="glass-inner flex flex-1 flex-col gap-3 p-4">
          <h3 className="min-h-10 text-sm font-semibold leading-snug text-zinc-100 transition-colors duration-200 group-hover:text-white">
            {product.name}
          </h3>

          <div className="mt-auto flex items-center justify-between gap-3 pt-3">
            <p className="text-base font-bold tabular-nums text-red-500">
              {product.price}
            </p>

            <Link
              href="/catalog"
              className="energy-strip btn rounded-md border border-white/[0.08] px-3 py-1.5 text-xs text-zinc-300 transition-colors duration-200 hover:border-red-600/30 hover:text-white"
            >
              В каталог
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
