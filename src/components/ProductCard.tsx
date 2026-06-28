"use client";

import Reveal from "./Reveal";

interface Product {
  name: string;
  category: string;
  price: string;
  img: string;
}

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <div className="group cursor-default">
        <div className="aspect-square rounded-xl overflow-hidden bg-zinc-800/50 border border-zinc-800/30 mb-4">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover img-zoom"
          />
        </div>
        <p className="text-xs text-red-500 uppercase tracking-wider mb-1">{product.category}</p>
        <h3 className="font-semibold text-zinc-200 mb-1 group-hover:text-red-400 transition-colors duration-200 text-[15px]">{product.name}</h3>
        <p className="text-zinc-500 text-sm">{product.price}</p>
      </div>
    </Reveal>
  );
}
