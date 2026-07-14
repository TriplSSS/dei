"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import AddToCartButton from "@/components/AddToCartButton";
import { type Product } from "@/data/products";

export default function ProductPageClient({ product, products }: { product: Product; products: Product[] }) {
  const [qty, setQty] = useState(1);
  const related = products
    .filter(p => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      {/* ── Хлебные крошки ── */}
      <div className="px-4 pb-0 pt-28 sm:px-6">
        <div className="mx-auto max-w-[1180px]">
          <nav className="flex items-center gap-2 text-xs text-zinc-700" aria-label="Навигационная цепочка">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-zinc-400 transition-colors">Каталог</Link>
            <span>/</span>
            <span className="text-zinc-400">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Основной контент ── */}
      <section className="px-4 pb-24 pt-8 sm:px-6">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">

            {/* Изображение */}
            <Reveal direction="left" delay={0}>
              <div className="product-photo-stage relative aspect-[4/3] overflow-hidden rounded-lg border border-white/[0.09]">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 560px"
                  className="product-photo-blend"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="rounded border border-white/[0.1] bg-black/50 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-zinc-300">
                    {product.categoryLabel}
                  </span>
                  {product.naks && (
                    <span className="rounded border border-emerald-400/20 bg-black/50 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-emerald-300">
                      НАКС
                    </span>
                  )}
                </div>
              </div>
            </Reveal>

            {/* Информация */}
            <Reveal direction="right" delay={0.08}>
              <div className="flex flex-col gap-6">
                {/* Заголовок */}
                <div>
                  <p className="page-kicker mb-4">{product.categoryLabel}</p>
                  <h1 className="text-[clamp(2.25rem,4.5vw,4.5rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-white">
                    {product.name}
                  </h1>
                  <p className="mt-5 max-w-[580px] text-base leading-relaxed text-zinc-400">{product.fullDescription}</p>
                </div>

                {/* Цена + покупка */}
                <div className="surface rounded-lg px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">Стоимость</p>
                      <p className="text-2xl font-semibold tabular-nums text-white">{product.price}</p>
                    </div>
                    {/* количество */}
                    <div className="flex items-center rounded-lg border border-white/[0.1] bg-black/20 shadow-[0_16px_38px_-28px_rgba(255,255,255,0.5)]">
                      <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white btn" aria-label="Меньше">−</button>
                      <span className="w-9 text-center text-white font-medium tabular-nums">{qty}</span>
                      <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white btn" aria-label="Больше">+</button>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-zinc-500 leading-relaxed">
                    Цена ориентировочная. Точную стоимость и счёт пришлём после оформления заявки.
                  </p>
                </div>

                {/* Технические характеристики */}
                <div className="surface overflow-hidden rounded-lg">
                  <div className="px-5 py-3 border-b border-white/[0.05]">
                    <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Технические характеристики</p>
                  </div>
                  <div className="grid gap-1 p-1">
                    {product.specs.map((spec) => (
                      <div key={spec.label} className="flex items-center justify-between rounded-lg bg-white/[0.018] px-4 py-3">
                        <span className="text-sm text-zinc-500">{spec.label}</span>
                        <span className="text-sm text-zinc-200 font-medium text-right max-w-[55%]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Теги */}
                <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/[0.08] pt-4">
                  {product.tags.map(tag => (
                    <span key={tag} className="text-xs text-zinc-600">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex gap-3">
                  <AddToCartButton
                    product={product}
                    qty={qty}
                    className="btn flex-1 bg-red-600 py-3.5 text-center text-sm font-semibold text-white hover:bg-red-500"
                  />
                  <a
                    href="tel:+79885807630"
                    className="btn border border-white/[0.12] px-5 py-3.5 text-center text-sm font-medium text-zinc-400 hover:text-white"
                  >
                    Позвонить
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Похожие товары ── */}
      {related.length > 0 && (
        <section className="px-4 pb-24 sm:px-6">
          <div className="mx-auto max-w-[1180px]">
            <Reveal direction="up">
              <h2
                className="mb-8 font-bold tracking-normal text-white"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}
              >
                Похожие <span className="text-red-500">товары</span>
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.07} direction="blur">
                  <Link href={`/catalog/${p.slug}`} className="block group">
                    <div className="product-card-premium hover-lift overflow-hidden rounded-lg">
                      <div className="product-photo-stage relative aspect-[4/3] overflow-hidden">
                        <Image src={p.img} alt={p.name} fill sizes="(max-width: 639px) 100vw, 33vw" className="product-photo-blend img-zoom" />
                      </div>
                      <div className="glass-inner p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{p.name}</p>
                          <p className="text-red-500 font-bold text-sm mt-1">{p.price}</p>
                        </div>
                        <span className="text-zinc-500 group-hover:text-red-400 transition-colors text-lg">→</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
