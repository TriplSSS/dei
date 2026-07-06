"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import AddToCartButton from "@/components/AddToCartButton";
import { PRODUCTS, CATEGORIES } from "@/data/products";

const PRICE_MIN = Math.min(...PRODUCTS.map((p) => p.priceNum));
const PRICE_MAX = Math.max(...PRODUCTS.map((p) => p.priceNum));
const ruble = (n: number) => n.toLocaleString("ru-RU") + " ₽";

export default function CatalogClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"default" | "asc" | "desc">("default");
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [onlyNaks, setOnlyNaks] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = activeCategory === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);
    if (onlyNaks) list = list.filter((p) => p.naks);
    list = list.filter((p) => p.priceNum <= maxPrice);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sort === "asc") list = [...list].sort((a, b) => a.priceNum - b.priceNum);
    if (sort === "desc") list = [...list].sort((a, b) => b.priceNum - a.priceNum);
    return list;
  }, [activeCategory, search, sort, maxPrice, onlyNaks]);

  const countByCat = (key: string) =>
    key === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === key).length;

  const reset = () => {
    setActiveCategory("all");
    setSearch("");
    setSort("default");
    setMaxPrice(PRICE_MAX);
    setOnlyNaks(false);
  };

  const Filters = (
    <div className="flex flex-col gap-8">
      {/* Категории */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Категории</p>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                activeCategory === cat.key
                  ? "bg-red-600/15 text-white"
                  : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-xs tabular-nums text-zinc-600">{countByCat(cat.key)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Цена */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Цена до</p>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-red-600"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 tabular-nums">
          <span>{ruble(PRICE_MIN)}</span>
          <span className="font-semibold text-red-400">до {ruble(maxPrice)}</span>
        </div>
      </div>

      {/* НАКС */}
      <div>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">Аттестация</p>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={onlyNaks}
            onChange={(e) => setOnlyNaks(e.target.checked)}
            className="h-4 w-4 accent-red-600"
          />
          Только с аттестацией НАКС
        </label>
      </div>

      <button onClick={reset} className="self-start text-xs text-zinc-500 hover:text-red-400 transition-colors">
        Сбросить фильтры
      </button>
    </div>
  );

  return (
    <>
      {/* ── Шапка ── */}
      <section className="relative px-6 pt-36 pb-10 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(220,38,38,0.06) 0%, transparent 70%)" }}
        />
        <div className="mx-auto max-w-[1400px]">
          <Reveal>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-red-500">Каталог</p>
            <h1
              className="font-bold tracking-tight text-white"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.5rem)", lineHeight: "0.95", letterSpacing: "-0.03em" }}
            >
              Продукция <span className="text-red-500">DEI</span>
            </h1>
            <p className="mt-4 max-w-[520px] text-zinc-400">
              Собственное производство в Ростове-на-Дону. Сварочное оборудование, промышленное освещение, центраторы и расходники.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[260px_1fr]">
          {/* ── Сайдбар (десктоп) ── */}
          <aside className="hidden lg:block">
            <div className="glass-card sticky top-28 rounded-2xl p-5">
              {Filters}
            </div>
          </aside>

          {/* ── Основная колонка ── */}
          <div>
            {/* Панель: счётчик + поиск + сортировка + фильтры(моб) */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-zinc-500">
                Найдено: <span className="font-semibold text-zinc-300 tabular-nums">{filtered.length}</span>
              </p>
              <div className="flex gap-2 sm:ml-auto">
                <button
                  onClick={() => setFiltersOpen((v) => !v)}
                  className="lg:hidden glass-pill rounded-xl px-4 py-2 text-sm text-zinc-300"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  Фильтры
                </button>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск по каталогу…"
                  className="glass-pill flex-1 rounded-xl px-4 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-red-600/40 sm:w-56 sm:flex-none"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="glass-pill cursor-pointer rounded-xl px-3 py-2 text-sm text-zinc-400 outline-none"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <option value="default" style={{ background: "#09090b" }}>Сортировка</option>
                  <option value="asc" style={{ background: "#09090b" }}>Дешевле</option>
                  <option value="desc" style={{ background: "#09090b" }}>Дороже</option>
                </select>
              </div>
            </div>

            {/* Фильтры (моб, раскрывающиеся) */}
            {filtersOpen && (
              <div className="glass-card mb-6 rounded-2xl p-5 lg:hidden">
                {Filters}
              </div>
            )}

            {/* Сетка */}
            {filtered.length === 0 ? (
              <div className="glass-card rounded-2xl py-20 text-center">
                <p className="text-zinc-500">Ничего не найдено</p>
                <button onClick={reset} className="mt-3 text-sm text-red-500 hover:text-red-400 transition-colors">
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((product, i) => (
                  <Reveal key={product.slug} delay={Math.min(i, 6) * 0.05}>
                    <div className="group glass-card hover-lift flex h-full flex-col overflow-hidden rounded-2xl transition-colors duration-300 hover:border-red-600/25">
                      <Link href={`/catalog/${product.slug}`} className="block">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img src={product.img} alt={product.name} className="h-full w-full object-cover img-zoom" />
                          <div className="absolute left-3 top-3 flex gap-1.5">
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
                      </Link>

                      <div className="flex flex-1 flex-col gap-2 p-4">
                        <Link href={`/catalog/${product.slug}`}>
                          <h3 className="text-sm font-semibold leading-snug text-zinc-100 transition-colors group-hover:text-white">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">{product.description}</p>

                        <div className="mt-auto flex items-end justify-between pt-2">
                          <p className="text-lg font-bold tabular-nums text-red-500">{product.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <AddToCartButton
                            product={product}
                            className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2.5 rounded-lg text-center"
                          />
                          <Link
                            href={`/catalog/${product.slug}`}
                            className="glass-pill flex items-center justify-center rounded-lg px-3 text-zinc-400 hover:text-white btn transition-colors"
                            aria-label="Подробнее"
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}

            {/* Нестандартный заказ */}
            <div className="glass-red mt-12 flex flex-col items-center gap-5 rounded-2xl px-8 py-8 sm:flex-row sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-white">Нужен нестандартный заказ?</p>
                <p className="mt-1 text-sm text-zinc-400">Изготовим по техническому заданию. Выезд к заказчику бесплатно.</p>
              </div>
              <a
                href="/contacts"
                className="shrink-0 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white btn transition-colors hover:bg-red-500"
              >
                Оставить заявку
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
