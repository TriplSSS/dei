import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";

export default function ProductPageClient({ product, products }: { product: Product; products: Product[] }) {
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 3);

  return (
    <div className="product-page-v11">
      <div className="product-page-v11__inner">
        <nav className="product-breadcrumbs-v11" aria-label="Навигационная цепочка">
          <Link href="/">Главная</Link><span>/</span>
          <Link href="/catalog">Каталог</Link><span>/</span>
          <span>{product.shortName}</span>
        </nav>

        <section className="product-main-v11">
          <div className="product-gallery-v11 product-photo-stage">
            <Image src={product.img} alt={product.name} fill priority sizes="(max-width: 899px) 92vw, 650px" className="product-photo-blend" />
            <div className="product-gallery-v11__badges">
              <span>{product.categoryLabel}</span>
              {product.naks && <span>НАКС</span>}
            </div>
            <span className="product-gallery-v11__hint">Изображение товара</span>
          </div>

          <aside className="product-buy-v11" aria-label="Информация о товаре">
            <p className="product-buy-v11__category">{product.categoryLabel}</p>
            <h1>{product.name}</h1>
            <p className="product-buy-v11__description">{product.fullDescription}</p>

            <div className="product-buy-v11__status"><span><i />Под заказ</span><b>{product.leadTime || "срок уточняется"}</b></div>
            <div className="product-buy-v11__price"><span>Ориентировочная цена</span><strong>{product.price}</strong></div>

            <div className="product-buy-v11__development">
              <span>Онлайн-заказ</span>
              <strong>В разработке</strong>
              <p>Корзина и отправка данных временно отключены. Уточнить наличие и комплектацию можно по телефону.</p>
            </div>

            <a href="tel:+79885807630" className="product-buy-v11__consult">Обсудить с инженером <span aria-hidden="true">↗</span></a>
            <p className="product-buy-v11__note">Итоговую комплектацию, стоимость и срок поставки подтвердит менеджер.</p>
          </aside>
        </section>

        <section className="product-info-v11">
          <article className="product-info-v11__description">
            <span>О товаре</span>
            <h2>Описание</h2>
            <p>{product.fullDescription}</p>
            <div className="product-info-v11__tags">{product.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </article>

          <article className="product-info-v11__specs">
            <span>Параметры</span>
            <h2>Характеристики</h2>
            <dl>
              {product.specs.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}
            </dl>
          </article>

          <article className="product-service-v11">
            <span>Сервис DEI</span>
            <h2>Поставка без лишней переписки</h2>
            <ul>
              <li><i>01</i> Уточняем рабочую задачу</li>
              <li><i>02</i> Подбираем комплектацию</li>
              <li><i>03</i> Подтверждаем цену и срок</li>
              <li><i>04</i> Организуем поставку</li>
            </ul>
            <Link href="/contacts">Контакты DEI</Link>
          </article>
        </section>

        {related.length > 0 && (
          <section className="product-related-v11">
            <div className="product-related-v11__head"><div><span>Каталог</span><h2>Другие товары</h2></div><Link href="/catalog">Смотреть все</Link></div>
            <div className="catalog-grid-v11">
              {related.map((item) => <ProductCard key={item.slug} product={item} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
