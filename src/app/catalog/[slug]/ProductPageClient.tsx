"use client";

import Link from "next/link";
import Reveal from "@/components/Reveal";
import { type Product, PRODUCTS } from "@/data/products";

export default function ProductPageClient({ product }: { product: Product }) {
  const related = PRODUCTS
    .filter(p => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  return (
    <>
      {/* ── Хлебные крошки ── */}
      <div className="pt-28 pb-0 px-6">
        <div className="max-w-[1400px] mx-auto">
          <nav className="flex items-center gap-2 text-xs text-zinc-600" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-zinc-400 transition-colors">Главная</Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-zinc-400 transition-colors">Каталог</Link>
            <span>/</span>
            <span className="text-zinc-400">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Основной контент ── */}
      <section className="pt-8 pb-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Изображение */}
            <Reveal direction="left" delay={0}>
              <div className="glass-card rounded-2xl overflow-hidden aspect-[4/3] relative">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="glass-pill rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider text-red-400">
                    {product.categoryLabel}
                  </span>
                  {product.naks && (
                    <span className="glass-pill rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-400">
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
                    className="font-bold text-white tracking-tight"
                    style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "-0.02em", lineHeight: "1" }}
                  >
                    {product.name}
                  </h1>
                  <p className="mt-3 text-zinc-400 text-base leading-relaxed">{product.fullDescription}</p>
                </div>

                {/* Цена */}
                <div className="glass-red rounded-xl px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest mb-0.5">Стоимость</p>
                    <p className="text-red-400 font-bold text-2xl tabular-nums">{product.price}</p>
                  </div>
                  <a
                    href="/contacts"
                    className="bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-xl btn text-sm transition-colors"
                  >
                    Запросить цену
                  </a>
                </div>

                {/* Технические характеристики */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-white/[0.05]">
                    <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Технические характеристики</p>
                  </div>
                  <div className="divide-y divide-white/[0.04]">
                    {product.specs.map((spec, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-3">
                        <span className="text-sm text-zinc-500">{spec.label}</span>
                        <span className="text-sm text-zinc-200 font-medium text-right max-w-[55%]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Теги */}
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span key={tag} className="glass-pill rounded-full px-3 py-1 text-xs text-zinc-500 tracking-wide">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex gap-3">
                  <a
                    href="/contacts"
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-3.5 rounded-xl btn text-sm text-center transition-colors"
                  >
                    Оставить заявку
                  </a>
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
        <section className="pb-24 px-6">
          <div className="max-w-[1400px] mx-auto">
            <Reveal direction="up">
              <h2
                className="font-bold text-white tracking-tight mb-8"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.02em" }}
              >
                Похожие <span className="text-red-500">товары</span>
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.07} direction="blur">
                  <Link href={`/catalog/${p.slug}`} className="block group">
                    <div className="glass-card hover-lift rounded-2xl overflow-hidden">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover img-zoom" />
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />
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
