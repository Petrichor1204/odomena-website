"use client";

import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-peach-dark/50 bg-peach-light/50 px-6 py-16 text-center">
        <p className="font-serif text-xl text-brown">New fabrics coming soon</p>
        <p className="mt-2 text-sm text-brown/60">
          Check back shortly for fresh pieces from Odomena.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
