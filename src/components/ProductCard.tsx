"use client";

import { Product } from "@/types/product";
import { SmartImage } from "./SmartImage";
import { HeartIcon, ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useState } from "react";
import { FavoriteButton } from "./favorites/FavoriteButton";
import { brl } from "@/utils/formatCurrency";
import { reviews } from "@/data/reviews";
import { RatingStars } from "@/app/(public)/produto/_components/RatingStars";
import Link from "next/link";

export function ProductCard({
  product,
  variant = "grid",
}: {
  product: Product;
  variant?: "grid" | "list";
}) {
  const title = product.title ?? product.name ?? "Produto";
  const price = brl(product.price);
  const { handleAddToCart } = useAddToCart();
  const [isAdding, setIsAdding] = useState(false);

  const totalReviews = reviews.length;
  const avgReviews =
    totalReviews > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews
      : 0;

  const onAdd = async () => {
    setIsAdding(true);

    try {
      await handleAddToCart(
        product.id,
        title,
        product.price,
        product.imageUrl,
        1,
      );
    } finally {
      setIsAdding(false);
    }
  };

  if (variant === "list") {
    return (
      <article className="flex items-center gap-4 rounded-xl border p-3 shadow-card flex-col lg:flex-row">
        <div className="flex lg:flex-1 lg:items-center">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-slate-50 mr-3">
            <SmartImage
              src={product.imageUrl ?? "/next.svg"}
              alt={title}
              fill
              className="object-cover w-full h-full"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 font-medium">{title}</h3>

            <div>
              <RatingStars value={avgReviews} size={16} />
            </div>

            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
              {product.description || "—"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2 max-sm:self-end">
          <div className="text-base font-semibold text-slate-900">{price}</div>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50"
              aria-label="Favoritar"
            >
              <HeartIcon size={18} color="red" />
            </button>
            <button
              type="button"
              onClick={onAdd}
              disabled={isAdding}
              aria-busy={isAdding}
              className="flex items-center rounded-lg bg-brand-800 px-3 py-2.5 text-sm font-medium text-white hover:bg-brand-900 disabled:opacity-60"
              aria-label={`Adicionar ${title} ao carrinho`}
            >
              <ShoppingCart size={18} className="mr-2" />
              {isAdding ? "Adicionando..." : "Adicionar"}
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="min-w-[220px] snap-start rounded-xl border shadow-card transition hover:-translate-y-0.5 hover:shadow max-sm:min-w-0 max-sm:mb-5 mx-1 lg:gap-0">
      <div className="relative aspect-square overflow-hidden rounded-md bg-slate-50">
        <a
          href={`/produto/${product.name
            ?.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")}?id=${product.id}`}
        >
          <SmartImage
            src={product.imageUrl ?? "/next.svg"}
            alt={title}
            fill
            className="w-full h-full object-cover"
          />
        </a>
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start flex-col lg:flex-row">
          <div>
            <h3 className="line-clamp-2 text-base font-medium">{title}</h3>

            <div>
              <RatingStars value={avgReviews} size={18} />
            </div>

            <div className="mt-1 text-base font-semibold text-slate-900">
              {price}
            </div>
          </div>

          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <FavoriteButton
              product={{
                id: product.id,
                name: product.name || "",
                price: product.price,
                imageUrl: product.imageUrl || "",
              }}
            />
          </div>
        </div>

        <div className="mt-3 flex gap-2 flex-col lg:flex-row self-end">
          <Link
            href={`/produto/${(product.name ?? "produto")
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9\s-]/g, "")
              .trim()
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")}?id=${product.id}`}
            className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Ver detalhes
          </Link>

          <button
            type="button"
            onClick={onAdd}
            disabled={isAdding}
            aria-busy={isAdding}
            className="flex items-center rounded-lg bg-brand-800 px-3 py-2.5 text-sm font-medium text-white hover:bg-brand-900 disabled:opacity-60"
            aria-label={`Adicionar ${title} ao carrinho`}
          >
            <ShoppingCart size={18} className="mr-2" />
            {isAdding ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </div>
    </article>
  );
}
