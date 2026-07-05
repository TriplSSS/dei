"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { PRODUCTS, CATEGORIES } from "@/data/products";

export default function CatalogClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"default" | "asc" | "desc">("default");

  const filtered = useMemo(() => {
    let list = activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === activeCategory);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (sort === "asc")  list = [...list].sort((a, b) => a.priceNum - b.priceNum);
    if (sort === "desc") list = [...list].sort((a, b) => b.priceNum - a.priceNum);

    return list;
  }, [activeCategory, search, sort]);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-12 px-6 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(220,38,38,0.05) 0%, transparent 70%)" }}
        />
        <div className="max-w-[1400px] mx-auto">
          <Reveal direction="up" delay={0}>
            <div className="inline-flex items-center gap-2 glass-pill rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-zinc-400 tracking-widest uppercase">Каталог</span>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.05}>
            <h1
              className="font-bold tracking-tight text-white mb-4"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)", lineHeight: "0.9", letterSpacing: "-0.03em" }}
            >
              Продукция <span className="text-red-500">DEI</span>
            </h1>
          </Reveal>

          <Reveal direction="up" delay={0.12}>
            <p className="text-zinc-400 text-lg max-w-[520px]">
              Собственное производство в Ростове-на-Дону. Сварочное оборудование, промышленное освещение, центраторы и расходники.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Фильтры ── */}
      <section className="sticky top-[72px] z-30 px-6 py-3 backdrop-blur-xl"
        style={{ background: "rgba(9,9,11,0.9)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row gap-3">

          {/* Категории */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`btn text-xs font-medium px-4 py-2 rounded-full transition-all duration-200 ${
                  activeCategory === cat.key
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                    : "glass-pill text-zinc-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Поиск + сортировка */}
          <div className="flex gap-2 sm:ml-auto">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="glass-pill rounded-full px-4 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-red-600/40 transition-all w-48"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            />
            <select
              value={sort}
              onChange={e => setSort(e.target.value as typeof sort)}
              className="glass-pill rounded-full px-3 py-2 text-sm text-zinc-400 outline-none cursor-pointer"
              style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <option value="default" style={{ background: "#09090b" }}>По умолчанию</option>
              <option value="asc"     style={{ background: "#09090b" }}>Сначала дешевле</option>
              <option value="desc"    style={{ background: "#09090b" }}>Сначала дороже</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Сетка товаров ── */}
      <section className="py-12 px-6 min-h-[40vh]">
        <div className="max-w-[1400px] mx-auto">

          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass-card rounded-2xl py-20 text-center"
              >
                <p className="text-zinc-500 text-lg">Ничего не найдено</p>
                <button
                  onClick={() => { setSearch(""); setActiveCategory("all"); }}
                  className="mt-4 text-red-500 hover:text-red-400 text-sm transition-colors"
                >
                  Сбросить фильтры
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={`${activeCategory}-${sort}`}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {filtered.map((product, i) => (
                  <Reveal key={product.slug} delay={i * 0.05} direction="blur">
                    <Link href={`/catalog/${product.slug}`} className="block group">
                      <div
                        className="glass-card hover-lift rounded-2xl overflow-hidden flex flex-col h-full"
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(220,38,38,0.35)";
                          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 0 1px rgba(220,38,38,0.15), 0 12px 32px -8px rgba(220,38,38,0.12)";
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLDivElement).style.borderColor = "";
                          (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                        }}
                      >
                        {/* Изображение */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img
                            src={product.img}
                            alt={product.name}
                            className="w-full h-full object-cover img-zoom"
                          />
                          <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/10 transition-colors duration-300" />
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            <span className="glass-pill rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-red-400">
                              {product.categoryLabel}
                            </span>
                            {product.naks && (
                              <span className="glass-pill rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-emerald-400">
                                НАКС
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent" />

                        {/* Контент */}
                        <div className="glass-inner flex flex-col gap-3 p-4 flex-1">
                          <h3 className="font-semibold text-zinc-100 text-sm leading-snug group-hover:text-white transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">{product.description}</p>

                          <div className="flex items-center justify-between mt-auto pt-1">
                            <p className="text-red-500 font-bold text-base tabular-nums">{product.price}</p>
                            <span className="btn glass-pill text-zinc-300 group-hover:text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
                              Подробнее →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <Reveal direction="up" delay={0.1} className="mt-16">
            <div className="glass-red rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
              <div>
                <p className="text-white font-semibold text-lg">Нужен нестандартный заказ?</p>
                <p className="text-zinc-400 text-sm mt-1">Изготовим по техническому заданию. Выезд к заказчику бесплатно.</p>
              </div>
              <a
                href="/contacts"
                className="shrink-0 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl btn transition-colors text-sm"
              >
                Оставить заявку
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
