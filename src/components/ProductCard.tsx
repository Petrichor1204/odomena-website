"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types";
import { RequestModal } from "./RequestModal";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function ProductCard({ product }: { product: Product }) {
  const [showRequest, setShowRequest] = useState(false);

  return (
    <>
      <article className="group card flex flex-col overflow-hidden transition hover:border-sky/60 hover:shadow-md">
        <div className="relative aspect-[3/4] overflow-hidden bg-peach-light">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brown/30 to-transparent opacity-0 transition group-hover:opacity-100" />
        </div>
        <div className="flex flex-1 flex-col gap-3 bg-gradient-to-b from-white to-peach-light/40 p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-semibold text-brown">{product.name}</h2>
            <p className="shrink-0 rounded-full bg-sky-light px-2.5 py-0.5 text-sm font-semibold text-brown-dark">
              {formatPrice(product.price)}
            </p>
          </div>
          {product.description && (
            <p className="text-sm leading-relaxed text-brown/70">
              {product.description}
            </p>
          )}
          <button
            type="button"
            onClick={() => setShowRequest(true)}
            className="btn-primary mt-auto w-full"
          >
            Request to Buy
          </button>
        </div>
      </article>

      {showRequest && (
        <RequestModal product={product} onClose={() => setShowRequest(false)} />
      )}
    </>
  );
}
