"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import type { Product, ProductCategory } from "@/data/products";

const ruble = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;
export default function CatalogClient({ products, categories }: { products: Product[]; categories: ProductCategory[] }) {
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const categoryKeys = categories.map((item) => item.key);
  const minPrice = products.length ? Math.min(...products.map((product) => product.priceNum)) : 0;
  const maxCatalogPrice = products.length ? Math.max(...products.map((product) => product.priceNum)) : 0;
  const [category, setCategory] = useState(
    requestedCategory && categoryKeys.includes(requestedCategory) ? requestedCategory : "all"
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"default" | "asc" | "desc">("default");
  const [maxPrice, setMaxPrice] = useState(maxCatalogPrice);
  const [onlyNaks, setOnlyNaks] = useState(false);
  const [moreFilters, setMoreFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = category === "all" ? products : products.filter((product) => product.category === category);
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery) {
      result = result.filter((product) =>
        [product.name, product.description, ...product.tags].some((value) => value.toLowerCase().includes(normalizedQuery))
      );
    }
    result = result.filter((product) => product.priceNum <= maxPrice);
    if (onlyNaks) result = result.filter((product) => product.naks);
    if (sort === "asc") result = [...result].sort((a, b) => a.priceNum - b.priceNum);
    if (sort === "desc") result = [...result].sort((a, b) => b.priceNum - a.priceNum);

    return result;
  }, [category, maxPrice, onlyNaks, products, query, sort]);

  const resetFilters = () => {
    setCategory("all");
    setQuery("");
    setSort("default");
    setMaxPrice(maxCatalogPrice);
    setOnlyNaks(false);
  };

  const activeExtraFilters = Number(maxPrice < maxCatalogPrice) + Number(onlyNaks);

  return (
    <div className="catalog-page-v11">
      <PageHeader
        centered
        title="Оборудование и материалы"
        description="Сварочное оборудование и промышленное освещение. Подберём комплектацию, подготовим счёт и организуем поставку."
      />

      <section className="catalog-section-v11" aria-label="Каталог товаров">
        <div className="catalog-section-v11__inner">
          <div className="catalog-controls-v11">
            <div className="catalog-categories-v11" role="group" aria-label="Категории товаров">
              {[{ key: "all", label: "Все" }, ...categories].map((item) => {
                const count = item.key === "all" ? products.length : products.filter((product) => product.category === item.key).length;
                return (
                  <button
                    key={item.key}
                    type="button"
                    className={category === item.key ? "is-active" : ""}
                    aria-pressed={category === item.key}
                    onClick={() => setCategory(item.key)}
                  >
                    {item.label}<span>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="catalog-search-v11">
              <label>
                <span className="sr-only">Поиск по названию</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" />
                </svg>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по названию…" />
              </label>
              <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} aria-label="Сортировка товаров">
                <option value="default">По умолчанию</option>
                <option value="asc">Сначала дешевле</option>
                <option value="desc">Сначала дороже</option>
              </select>
              <button
                type="button"
                className={`catalog-filter-toggle-v11${moreFilters ? " is-active" : ""}`}
                aria-expanded={moreFilters}
                aria-controls="catalog-extra-filters"
                onClick={() => setMoreFilters((value) => !value)}
              >
                Фильтры{activeExtraFilters > 0 && <span>{activeExtraFilters}</span>}
              </button>
            </div>

            {moreFilters && (
              <div id="catalog-extra-filters" className="catalog-extra-filters-v11">
                <label>
                  <span>Цена до <strong>{ruble(maxPrice)}</strong></span>
                  <input type="range" min={minPrice} max={maxCatalogPrice} step={100} value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} />
                </label>
                <label className="catalog-check-v11">
                  <input type="checkbox" checked={onlyNaks} onChange={(event) => setOnlyNaks(event.target.checked)} />
                  <span>Только с аттестацией НАКС</span>
                </label>
                <button type="button" onClick={resetFilters}>Сбросить всё</button>
              </div>
            )}
          </div>

          <div className="catalog-result-v11">
            <p>Найдено товаров: <strong>{filteredProducts.length}</strong></p>
            {(query || category !== "all" || activeExtraFilters > 0) && <button type="button" onClick={resetFilters}>Очистить фильтры</button>}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="catalog-grid-v11">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.slug} product={product} priority={index === 0} />
              ))}
            </div>
          ) : (
            <div className="catalog-empty-v11">
              <span>0 товаров</span>
              <h2>По этим параметрам ничего не найдено</h2>
              <p>Попробуйте изменить категорию, цену или поисковый запрос.</p>
              <button type="button" onClick={resetFilters}>Сбросить фильтры</button>
            </div>
          )}

          <div className="catalog-help-v11">
            <div>
              <h2>Не нашли нужную комплектацию?</h2>
              <p>Опишите задачу — инженер предложит оборудование и рассчитает стоимость поставки.</p>
            </div>
            <Link href="/contacts">Связаться с DEI <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
