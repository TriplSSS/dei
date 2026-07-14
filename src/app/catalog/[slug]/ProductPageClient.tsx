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
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 3);

  return (
    <div className="product-v10">
      <div className="product-v10__breadcrumbs">
        <div className="product-detail-shell">
          <nav aria-label="Навигационная цепочка">
            <Link href="/">Главная</Link><span>/</span>
            <Link href="/catalog">Каталог</Link><span>/</span>
            <span>{product.shortName}</span>
          </nav>
        </div>
      </div>

      <header className="product-v10__header">
        <div className="product-detail-shell">
          <div className="product-v10__header-grid">
            <Reveal>
              <div>
                <p className="product-v10__category">{product.categoryLabel}</p>
                <h1>{product.name}</h1>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="product-v10__lead">{product.fullDescription}</p>
            </Reveal>
          </div>
        </div>
      </header>

      <section className="product-v10__overview">
        <div className="product-detail-shell product-v10__overview-grid">
          <Reveal direction="left">
            <div className="product-v10__stage product-photo-stage">
              <Image
                src={product.img}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 760px"
                className="product-photo-blend"
              />
              <div className="product-v10__badges">
                <span>{product.categoryLabel}</span>
                {product.naks && <span>Аттестация НАКС</span>}
              </div>
              <span className="product-v10__stage-index" aria-hidden="true">DEI / PRODUCT</span>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.08}>
            <aside className="product-v10__order" aria-label="Заказ товара">
              <div className="product-v10__availability"><span /> Доступно к заказу</div>
              <div className="product-v10__price">
                <span>Ориентировочная стоимость</span>
                <strong>{product.price}</strong>
              </div>

              <div className="product-v10__quantity">
                <span>Количество</span>
                <div>
                  <button type="button" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Уменьшить количество">−</button>
                  <output aria-live="polite">{qty}</output>
                  <button type="button" onClick={() => setQty((value) => value + 1)} aria-label="Увеличить количество">+</button>
                </div>
              </div>

              <p className="product-v10__note">Точную стоимость, комплектацию и срок поставки подтвердит менеджер после получения заявки.</p>

              <AddToCartButton
                product={product}
                qty={qty}
                className="product-v10__primary btn bg-red-600 text-center font-semibold text-white hover:bg-red-500"
              />
              <a href="tel:+79885807630" className="product-v10__secondary btn">Обсудить с инженером</a>

              <div className="product-v10__tags">
                {product.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      <section className="product-v10__technical">
        <div className="product-detail-shell product-v10__technical-grid">
          <div>
            <p className="section-kicker">Технические данные</p>
            <h2>Рабочие характеристики</h2>
            <p>Параметры базовой комплектации. Для нестандартного исполнения подготовим отдельную спецификацию.</p>
          </div>
          <dl className="product-v10__specs">
            {product.specs.map((spec, index) => (
              <div key={spec.label}>
                <dt><span>{String(index + 1).padStart(2, "0")}</span>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {related.length > 0 && (
        <section className="product-v10__related">
          <div className="product-detail-shell">
            <div className="product-v10__related-head">
              <p className="section-kicker">Ещё в категории</p>
              <Link href="/catalog">Весь каталог <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="product-v10__related-list">
              {related.map((item, index) => (
                <Reveal key={item.slug} delay={index * 0.05}>
                  <Link href={`/catalog/${item.slug}`} className="product-v10__related-item">
                    <div className="product-photo-stage">
                      <Image src={item.img} alt={item.name} fill sizes="(max-width: 639px) 100vw, 33vw" className="product-photo-blend" />
                    </div>
                    <div><span>{item.categoryLabel}</span><strong>{item.name}</strong><b>{item.price}</b></div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
