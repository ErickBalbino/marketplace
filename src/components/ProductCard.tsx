"use client";

import { Product } from "@/types/product";
import { SmartImage } from "./SmartImage";
import { HeartIcon, ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useState } from "react";

function brl(n: number) {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(n);
  } catch {
    return `R$ ${Number(n || 0).toFixed(2)}`;
  }
}

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
    <article className="min-w-[220px] snap-start rounded-xl border shadow-card transition hover:-translate-y-0.5 hover:shadow max-sm:w-[170px] max-sm:min-w-0 max-sm:mb-5">
      <div className="relative aspect-square overflow-hidden rounded-md bg-slate-50">
        <SmartImage
          src={product.imageUrl ?? "/next.svg"}
          alt={title}
          fill
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start flex-col lg:flex-row">
          <div>
            <h3 className="line-clamp-2 text-sm font-medium">{title}</h3>
            <div className="mt-1 text-base font-semibold text-slate-900">
              {price}
            </div>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 hover:bg-gray-100 max-sm:self-end"
            aria-label="Favoritar"
          >
            <HeartIcon size={18} color="red" />
          </button>
        </div>

        <div className="mt-3 flex gap-2 flex-col lg:flex-row self-end">
          <a
            href={`/produto/${product.name
              ?.toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9\s-]/g, "")
              .trim()
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")}?id=${product.id}`}
            className="inline-flex items-center rounded-lg border border-slate-400 px-3 py-1.5 text-sm hover:bg-slate-100"
          >
            Ver detalhes
          </a>

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
