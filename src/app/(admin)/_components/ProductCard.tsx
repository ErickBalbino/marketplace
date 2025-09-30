"use client";

import { resolveImageSrc } from "@/lib/images";
import { Product } from "@/types/product";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

export function ProductAdminCard({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}) {
  const imageUrl = resolveImageSrc(product.imageUrl);

  return (
    <article className="rounded-xl border bg-white p-3 shadow-sm">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-50">
        <Image
          src={imageUrl}
          alt={product.name || "Imagem do produto"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/next.svg";
          }}
        />
      </div>

      <div className="mt-3">
        <h3 className="line-clamp-2 text-sm font-medium">
          {product.name || "Sem nome"}
        </h3>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(product.price || 0)}
        </p>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(product)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 flex items-center justify-center gap-1"
        >
          <Pencil size={14} />
          Editar
        </button>
        <button
          type="button"
          onClick={() => onDelete(product)}
          className="flex-1 rounded-lg border border-rose-300 px-3 py-1.5 text-sm text-rose-700 hover:bg-rose-50 flex items-center justify-center gap-1"
        >
          <Trash2 size={14} />
          Excluir
        </button>
      </div>
    </article>
  );
}
