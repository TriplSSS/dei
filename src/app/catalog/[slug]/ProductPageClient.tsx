"use client";

import { useState } from "react";
import Link from "next/link";
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
      <div className="relative px-6 pb-0 pt-28">
        <div aria-hidden className="ambient-red-grid pointer-events-none absolute inset-x-0 top-0 h-[360px] opacity-45" />
        <div className="max-w-[1400px] mx-auto">
          <nav className="relative flex items-center gap-2 text-xs text-zinc-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-zinc-400 transition-colors">Каталог</Link>
            <span>/</span>
            <span className="text-zinc-400">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Основной контент ── */}
      <section className="relative px-6 pb-20 pt-8">
        <div className="relative max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Изображение */}
            <Reveal direction="left" delay={0}>
              <div className="product-photo-stage premium-panel glass-card relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_36px_110px_-72px_rgba(220,38,38,0.9)]">
                <img
                  src={product.img}
                  alt={product.name}
                  className="product-photo-blend relative h-full w-full"
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(9,9,11,0.68),transparent_58%)]" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="glass-pill rounded-md px-3 py-1 text-xs font-medium uppercase tracking-normal text-red-300">
                    {product.categoryLabel}
                  </span>
                  {product.naks && (
                    <span className="glass-pill rounded-md px-3 py-1 text-xs font-medium uppercase tracking-normal text-emerald-300">
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
                  <h1
                    className="font-bold hero-title-gradient tracking-normal"
                    style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: "1" }}
                  >
                    {product.name}
                  </h1>
                  <p className="mt-3 text-zinc-400 text-base leading-relaxed">{product.fullDescription}</p>
                </div>

                {/* Цена + покупка */}
                <div className="premium-panel glass-red rounded-xl px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">Стоимость</p>
                      <p className="text-red-400 font-bold text-2xl tabular-nums">{product.price}</p>
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
                <div className="premium-panel glass-card rounded-2xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/[0.05]">
                    <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Технические характеристики</p>
                  </div>
                  <div className="grid gap-1 p-1">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-white/[0.018] px-4 py-3">
                        <span className="text-sm text-zinc-500">{spec.label}</span>
                        <span className="text-sm text-zinc-200 font-medium text-right max-w-[55%]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Теги */}
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span key={tag} className="glass-pill rounded-md px-3 py-1 text-xs text-zinc-500 tracking-normal">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex gap-3">
                  <AddToCartButton
                    product={product}
                    qty={qty}
                    className="energy-strip flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-3.5 rounded-xl text-sm text-center"
                  />
                  <a
                    href="tel:+79885807630"
                    className="glass-pill hover:text-white text-zinc-400 font-medium py-3.5 px-5 rounded-xl btn text-sm text-center transition-colors"
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
        <section className="relative px-6 pb-24">
          <div className="max-w-[1400px] mx-auto">
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
                    <div className="product-card-premium glass-card hover-lift rounded-2xl overflow-hidden">
                      <div className="product-photo-stage relative aspect-[4/3] overflow-hidden">
                        <img src={p.img} alt={p.name} className="product-photo-blend relative w-full h-full img-zoom" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(9,9,11,0.62),transparent_58%)]" />
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
