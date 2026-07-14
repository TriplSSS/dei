"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import type { Product } from "@/data/products";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  featured?: boolean;
};

export default function ProductCard({ product, priority = false, featured = false }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

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
          {featured && <span className="is-accent">Выбор DEI</span>}
          {product.naks && <span>НАКС</span>}
        </div>
        <span className="product-card-v11__availability"><i />Под заказ</span>
      </Link>

      <div className="product-card-v11__body">
        <p className="product-card-v11__category">{product.categoryLabel}</p>
        <Link href={`/catalog/${product.slug}`}>
          <h2>{product.name}</h2>
        </Link>
        <p className="product-card-v11__description">{product.description}</p>
        <div className="product-card-v11__price">{product.price}</div>

        <div className="product-card-v11__actions">
          <div className="product-card-v11__quantity" aria-label="Количество">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Уменьшить количество">−</button>
            <output aria-live="polite">{quantity}</output>
            <button type="button" onClick={() => setQuantity((value) => value + 1)} aria-label="Увеличить количество">+</button>
          </div>
          <AddToCartButton product={product} qty={quantity} className="product-card-v11__cart" label="В корзину" />
          <Link href={`/catalog/${product.slug}`} className="product-card-v11__details" aria-label={`Подробнее: ${product.name}`}>↗</Link>
        </div>
      </div>
    </article>
  );
}
