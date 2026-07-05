"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";

export default function AddToCartButton({
  product,
  qty = 1,
  className = "",
  label = "В корзину",
}: {
  product: Pick<Product, "slug" | "name" | "price" | "priceNum" | "img">;
  qty?: number;
  className?: string;
  label?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add(
          {
            slug: product.slug,
            name: product.name,
            price: product.price,
            priceNum: product.priceNum,
            img: product.img,
          },
          qty
        );
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
      }}
      className={`btn transition-colors ${className}`}
    >
      {added ? "Добавлено ✓" : label}
    </button>
  );
}
