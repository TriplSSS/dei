"use client";

import Link from "next/link";
import Image from "next/image";
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
      <div className="product-card-premium group flex cursor-default flex-col overflow-hidden">
        <div className="product-photo-stage relative aspect-[4/3] overflow-hidden">
          <Image
            src={product.img}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="product-photo-blend img-zoom object-cover"
          />
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center border border-white/15 bg-black/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-normal text-zinc-300">
              {product.category}
            </span>
          </div>
          <div className="absolute bottom-3 right-3 border border-white/[0.08] bg-black/70 px-2 py-1 text-[10px] font-medium text-zinc-300">
            В наличии / под заказ
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="min-h-10 text-sm font-semibold leading-snug text-zinc-100 transition-colors duration-200 group-hover:text-white">
            {product.name}
          </h3>

          <div className="mt-auto flex items-center justify-between gap-3 pt-3">
            <p className="text-base font-bold tabular-nums text-red-500">
              {product.price}
            </p>

            <Link
              href="/catalog"
              className="btn border-b border-white/20 px-1 py-1.5 text-xs text-zinc-300 transition-colors duration-200 hover:border-red-500 hover:text-white"
            >
              В каталог
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
