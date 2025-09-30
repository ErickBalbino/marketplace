"use client";

import { SmartImage } from "@/components/SmartImage";
import { Product } from "@/types/product";
import { brl } from "@/utils/formatCurrency";
import { ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";

interface Props {
  p: Product;
  busy: string | null;
  title: string;
  handleAddToCart: (p: Product) => Promise<void>;
  handleRemove: (p: Product) => void;
  view: "grid" | "list";
}

export function FavoriteItem({
  p,
  busy,
  title,
  handleAddToCart,
  handleRemove,
  view,
}: Props) {
  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleRemove(p);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCart(p);
  };

  if (view === "grid") {
    return (
      <div className="group rounded-xl border shadow-card hover:shadow hover:scale-101 transition-all cursor-pointer">
        <Link href={`/produto/${p.name}?id=${p.id}`}>
          <div className="relative aspect-square overflow-hidden rounded-md bg-slate-50">
            <SmartImage
              src={p.imageUrl ?? "/next.svg"}
              alt={title}
              fill
              className="w-full h-full object-cover"
            />
          </div>
        </Link>

        <div className="p-3">
          <Link href={`/produto/${p.name}?id=${p.id}`}>
            <h3 className="line-clamp-2 text-sm font-medium hover:text-brand-700 transition-colors">
              {title}
            </h3>
          </Link>
          <div className="mt-1 text-base font-semibold text-slate-900">
            {brl(p.price)}
          </div>

          <div className="mt-3 flex gap-2">
            <Link
              href={`/produto/${(p.name ?? "produto")
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")}?id=${p.id}`}
              className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Ver detalhes
            </Link>

            <button
              type="button"
              onClick={handleAddToCartClick}
              disabled={busy === p.id}
              className="inline-flex items-center rounded-lg bg-brand-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-900 disabled:opacity-50"
            >
              <ShoppingCart size={16} className="mr-2" />
              Adicionar
            </button>

            <button
              type="button"
              onClick={handleRemoveClick}
              className="ml-auto inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
              aria-label={`Remover ${title} dos favoritos`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 p-4 border-b last:border-b-0">
      <Link href={`/produto/${p.name}?id=${p.id}`}>
        <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-slate-50 mr-3">
          <SmartImage
            src={p.imageUrl ?? "/next.svg"}
            alt={title}
            fill
            className="object-cover w-full h-full"
          />
        </div>
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={`/produto/${p.name}?id=${p.id}`}>
          <h3 className="truncate font-medium hover:text-brand-700 transition-colors">
            {title}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-slate-600">{brl(p.price)}</p>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCartClick}
            disabled={busy === p.id}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-800 px-3 py-2 text-sm font-medium text-white hover:bg-brand-900 disabled:opacity-50"
          >
            <ShoppingCart size={16} /> Adicionar
          </button>

          <button
            type="button"
            onClick={handleRemoveClick}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50"
            aria-label={`Remover ${title} dos favoritos`}
          >
            <Trash2 size={16} /> Remover
          </button>
        </div>
      </div>

      <div className="text-right font-semibold">{brl(p.price)}</div>
    </div>
  );
}
