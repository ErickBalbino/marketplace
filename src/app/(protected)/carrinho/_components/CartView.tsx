"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

function currency(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);
}

export default function CartView() {
  const {
    cart,
    isLoading,
    isInitialized,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    refreshCart,
  } = useCart();
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());

  // Se não estiver inicializado, mostra loading
  if (!isInitialized) {
    return (
      <div className="rounded-2xl border p-6">
        <div className="animate-pulse">
          <div className="h-6 w-40 rounded bg-slate-200 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="h-20 w-20 rounded bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-200" />
                  <div className="h-4 w-1/4 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const handleWithLoading = async (
    itemId: string,
    operation: () => Promise<void>,
  ) => {
    setLoadingItems((prev) => new Set(prev).add(itemId));
    try {
      await operation();
    } catch {
      // Error já é tratado no contexto
    } finally {
      setLoadingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleIncrease = async (productId: string) => {
    await handleWithLoading(productId, () => increaseQuantity(productId));
  };

  const handleDecrease = async (
    productId: string,
    productName: string,
    currentQuantity: number,
  ) => {
    if (currentQuantity <= 1) {
      await handleRemove(productId, productName);
      return;
    }

    await handleWithLoading(productId, () => decreaseQuantity(productId));
  };

  const handleRemove = async (productId: string, productName: string) => {
    await handleWithLoading(productId, async () => {
      await removeItem(productId);
      toast.success(`${productName} removido do carrinho`);
    });
  };

  const hasItems = cart.items.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border">
        {hasItems ? (
          <ul role="list" className="divide-y">
            {cart.items.map((product) => {
              const isItemLoading = loadingItems.has(product.id);
              const isDisabled = isLoading || isItemLoading;

              return (
                <li
                  key={product.id}
                  className="flex items-start gap-4 p-4 relative"
                >
                  {isItemLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-800"></div>
                    </div>
                  )}

                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-50">
                    <Image
                      src={product.imageUrl || "/next.svg"}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-medium">{product.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {currency(product.price)}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleDecrease(
                            product.id,
                            product.name,
                            product.quantity,
                          )
                        }
                        disabled={isDisabled || product.quantity <= 1}
                        aria-label="Diminuir quantidade"
                        className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">
                        {product.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncrease(product.id)}
                        disabled={isDisabled}
                        aria-label="Aumentar quantidade"
                        className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(product.id, product.name)}
                        disabled={isDisabled}
                        className="ml-3 rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
                      >
                        Remover
                      </button>
                    </div>
                  </div>

                  <div className="text-right font-semibold">
                    {currency(product.price * product.quantity)}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <p className="text-slate-700">Seu carrinho está vazio.</p>
            <button
              type="button"
              onClick={refreshCart}
              className="mt-3 rounded-xl border px-4 py-2 text-sm hover:bg-slate-50"
            >
              Atualizar
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border p-5">
        <h2 className="text-lg font-semibold">Resumo</h2>
        <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
          <span>Subtotal</span>
          <span>{currency(cart.total)}</span>
        </div>

        <div className="mt-6">
          <button
            type="button"
            disabled={!hasItems || isLoading}
            className="w-full rounded-xl bg-brand-800 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-50"
          >
            {isLoading ? "Processando..." : "Finalizar compra"}
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Valores de frete e cálculo de prazo são exibidos na próxima etapa.
        </p>
      </div>
    </div>
  );
}
