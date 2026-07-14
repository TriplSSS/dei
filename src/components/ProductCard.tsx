import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  featured?: boolean;
};

const availabilityLabels: Record<NonNullable<Product["availabilityStatus"]>, string> = {
  in_stock: "В наличии",
  on_order: "Под заказ",
  preorder: "Предзаказ",
  out_of_stock: "Нет в наличии",
};

export default function ProductCard({ product, priority = false, featured = false }: ProductCardProps) {
  const isFeatured = featured || Boolean(product.featured);

  return (
    <article className="product-card-v11">
      <Link href={`/catalog/${product.slug}`} className="product-card-v11__media" aria-label={product.name}>
        <Image
          src={product.img}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 380px"
          className="product-card-v11__image product-photo-blend"
        />
        <div className="product-card-v11__badges">
          {isFeatured && <span className="is-accent">Выбор DEI</span>}
          {product.naks && <span>НАКС</span>}
        </div>
        <span className={`product-card-v11__availability is-${product.availabilityStatus || "on_order"}`}>
          <i />
          {availabilityLabels[product.availabilityStatus || "on_order"]}
        </span>
      </Link>

      <div className="product-card-v11__body">
        <p className="product-card-v11__category">{product.categoryLabel}</p>
        <Link href={`/catalog/${product.slug}`}>
          <h2>{product.name}</h2>
        </Link>
        <div className="product-card-v11__price">
          <strong>{product.price}</strong>
          {product.oldPrice && <s>{product.oldPrice.toLocaleString("ru-RU")} ₽</s>}
        </div>

        <div className="product-card-v11__actions">
          <span className="product-card-v11__development">
            <i aria-hidden="true" />
            В разработке
          </span>
          <Link href={`/catalog/${product.slug}`} className="product-card-v11__details" aria-label={`Подробнее: ${product.name}`}>
            <span>Подробнее</span><b aria-hidden="true">↗</b>
          </Link>
        </div>
      </div>
    </article>
  );
}
