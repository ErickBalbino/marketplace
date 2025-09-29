"use client";

import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useAddToCart } from "@/hooks/useAddToCart";

export function BuyBox({
  priceLabel,
  productName,
  productId,
  productPrice,
  productImage,
}: {
  priceLabel: string;
  productName: string;
  productId: string;
  productPrice: number;
  productImage?: string;
}) {
  const [qty, setQty] = useState(1);
  const { handleAddToCart } = useAddToCart();
  const [isAdding, setIsAdding] = useState(false);

  const onAdd = async () => {
    setIsAdding(true);
    try {
      await handleAddToCart(
        productId,
        productName,
        productPrice,
        productImage,
        qty,
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="rounded-2xl border p-5 shadow-card">
      <p className="text-sm text-slate-600">Preço</p>
      <div className="mt-1 text-3xl font-semibold text-slate-900">
        {priceLabel}
      </div>
      <p className="mt-1 text-sm text-slate-600">
        em até 10x sem juros no cartão
      </p>

      <div className="mt-5 flex items-center gap-3">
        <div className="inline-flex items-center overflow-hidden rounded-xl border">
          <button
            type="button"
            className="px-3 py-2 text-lg hover:bg-slate-100"
            onClick={() => setQty((n) => Math.max(1, n - 1))}
            aria-label="Diminuir quantidade"
          >
            –
          </button>
          <input
            id="qtd"
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-12 border-x px-2 py-2 text-center outline-none"
            inputMode="numeric"
          />
          <button
            type="button"
            className="px-3 py-2 text-lg hover:bg-slate-100"
            onClick={() => setQty((n) => n + 1)}
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <button
          type="button"
          className="rounded-xl bg-brand-800 px-4 py-3 text-sm font-medium text-white hover:bg-brand-900 flex items-center justify-center disabled:opacity-60"
          onClick={onAdd}
          disabled={isAdding}
          aria-busy={isAdding}
        >
          <ShoppingCart size={20} className="mr-4" />
          {isAdding ? "Adicionando..." : "Comprar Agora"}
        </button>
      </div>
    </div>
  );
}
