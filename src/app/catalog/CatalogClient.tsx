"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Reveal from "@/components/Reveal";
import AddToCartButton from "@/components/AddToCartButton";
import { PRODUCTS, CATEGORIES } from "@/data/products";

const PRICE_MIN = Math.min(...PRODUCTS.map((p) => p.priceNum));
const PRICE_MAX = Math.max(...PRODUCTS.map((p) => p.priceNum));
const ruble = (n: number) => n.toLocaleString("ru-RU") + " ₽";
const CATEGORY_KEYS = CATEGORIES.map((c) => c.key as string);

export default function CatalogClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState(
    initialCategory && CATEGORY_KEYS.includes(initialCategory) ? initialCategory : "all"
  );
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
  const activeCategoryLabel = CATEGORIES.find((cat) => cat.key === activeCategory)?.label ?? "Все";
  const hasPriceFilter = maxPrice < PRICE_MAX;
  const activeFilterCount = (activeCategory !== "all" ? 1 : 0) + (hasPriceFilter ? 1 : 0) + (onlyNaks ? 1 : 0);
  const hasCatalogState = activeFilterCount > 0 || search.trim().length > 0 || sort !== "default";

  const reset = () => {
    setActiveCategory("all");
    setSearch("");
    setSort("default");
    setMaxPrice(PRICE_MAX);
    setOnlyNaks(false);
  };

  const Filters = (
    <div className="flex flex-col gap-6 lg:gap-8">
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
      <section className="relative overflow-hidden px-4 pb-8 pt-32 sm:px-6 md:pb-10 md:pt-36">
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
            <p className="mt-4 max-w-[520px] text-sm leading-relaxed text-zinc-400 sm:text-base">
              Собственное производство в Ростове-на-Дону. Сварочное оборудование, промышленное освещение, центраторы и расходники.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid min-w-0 max-w-[1400px] gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8">
          {/* ── Сайдбар (десктоп) ── */}
          <aside className="hidden lg:block">
            <div className="glass-card sticky top-28 rounded-2xl p-5">
              {Filters}
            </div>
          </aside>

          {/* ── Основная колонка ── */}
          <div className="min-w-0">
            {/* Панель: счётчик + поиск + сортировка + фильтры(моб) */}
            <div className="mb-5 min-w-0 rounded-lg border border-white/[0.07] bg-white/[0.025] p-2.5 backdrop-blur-xl sm:p-3">
              <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-center">
                <div className="flex min-w-0 items-center justify-between gap-3 md:min-w-[190px]">
                  <p className="text-sm text-zinc-500">
                    Показано{" "}
                    <span className="font-semibold text-zinc-200 tabular-nums">{filtered.length}</span>
                    <span className="text-zinc-600"> / {PRODUCTS.length}</span>
                  </p>
                  <button
                    onClick={() => setFiltersOpen((v) => !v)}
                    className="glass-pill inline-flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm text-zinc-300 lg:hidden"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    Фильтры
                    {activeFilterCount > 0 && (
                      <span className="rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>

                <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_7.75rem] gap-2 md:ml-auto md:flex md:items-center">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Поиск по каталогу…"
                    className="glass-pill min-w-0 rounded-lg px-3.5 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-red-600/40 md:w-64 md:flex-none"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as typeof sort)}
                    className="glass-pill w-full cursor-pointer rounded-lg px-3 py-2 text-sm text-zinc-400 outline-none md:w-auto"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <option value="default" style={{ background: "#09090b" }}>Сортировка</option>
                    <option value="asc" style={{ background: "#09090b" }}>Дешевле</option>
                    <option value="desc" style={{ background: "#09090b" }}>Дороже</option>
                  </select>
                </div>
              </div>

              <div className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5 text-xs">
                <span className="rounded-md border border-white/[0.06] bg-black/20 px-2 py-1 text-zinc-500">
                  {activeCategoryLabel}
                </span>
                {hasPriceFilter && (
                  <span className="rounded-md border border-white/[0.06] bg-black/20 px-2 py-1 text-zinc-500">
                    до {ruble(maxPrice)}
                  </span>
                )}
                {onlyNaks && (
                  <span className="rounded-md border border-emerald-400/15 bg-emerald-400/10 px-2 py-1 text-emerald-300">
                    НАКС
                  </span>
                )}
                {hasCatalogState && (
                  <button onClick={reset} className="ml-auto rounded-md px-2 py-1 text-zinc-500 transition-colors hover:text-red-400">
                    Сбросить
                  </button>
                )}
              </div>
            </div>

            {/* Фильтры (моб, раскрывающиеся) */}
            {filtersOpen && (
              <div className="glass-card mb-5 rounded-lg p-4 lg:hidden">
                {Filters}
              </div>
            )}

            {/* Сетка */}
            {filtered.length === 0 ? (
              <div className="glass-card rounded-lg py-16 text-center">
                <p className="text-zinc-500">Ничего не найдено</p>
                <button onClick={reset} className="mt-3 text-sm text-red-500 hover:text-red-400 transition-colors">
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
                {filtered.map((product, i) => (
                  <Reveal key={product.slug} delay={Math.min(i, 6) * 0.05}>
                    <div className="group glass-card hover-lift flex h-full min-w-0 flex-col overflow-hidden rounded-lg transition-colors duration-300 hover:border-red-600/25">
                      <Link href={`/catalog/${product.slug}`} className="block">
                        <div className="relative aspect-[16/10] overflow-hidden">
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

                      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3 sm:p-4">
                        <Link href={`/catalog/${product.slug}`} className="min-w-0">
                          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100 transition-colors group-hover:text-white">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">{product.description}</p>

                        <div className="grid gap-1.5 border-t border-white/[0.05] pt-2">
                          {product.specs.slice(0, 2).map((spec) => (
                            <div key={spec.label} className="flex min-w-0 items-center justify-between gap-3 text-[11px] leading-none">
                              <span className="truncate text-zinc-600">{spec.label}</span>
                              <span className="shrink-0 font-medium text-zinc-300">{spec.value}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-auto flex items-baseline justify-between gap-3 border-t border-white/[0.05] pt-3">
                          <p className="text-base font-bold tabular-nums text-red-500 sm:text-lg">{product.price}</p>
                          <span className="shrink-0 text-[11px] text-zinc-600">под заказ</span>
                        </div>
                        <div className="flex min-w-0 gap-2">
                          <AddToCartButton
                            product={product}
                            className="min-w-0 flex-1 rounded-lg bg-red-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-red-500"
                          />
                          <Link
                            href={`/catalog/${product.slug}`}
                            className="glass-pill btn flex shrink-0 items-center justify-center rounded-lg px-3 text-zinc-400 transition-colors hover:text-white"
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
            <div className="glass-red mt-10 flex flex-col items-start gap-5 rounded-lg px-5 py-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-8">
              <div className="min-w-0">
                <p className="text-lg font-semibold text-white">Нужен нестандартный заказ?</p>
                <p className="mt-1 text-sm text-zinc-400">Изготовим по техническому заданию. Выезд к заказчику бесплатно.</p>
              </div>
              <a
                href="/contacts"
                className="btn shrink-0 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500"
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
