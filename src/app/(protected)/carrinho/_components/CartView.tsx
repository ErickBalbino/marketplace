"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import type { Cart, CartProduct } from "@/types/cart";
import { cartService } from "@/services/cart/client";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

type Props = { initialCart: Cart };

function currency(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);
}

export default function CartView({ initialCart }: Props) {
  const { cart, updateQuantity, removeItem, setCart } = useCart(initialCart);
  const [busy, setBusy] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!syncing) {
        try {
          const freshCart = await cartService.fetchCart();
          setCart(freshCart);
        } catch (error) {
          console.warn("Falha na sincronização do carrinho:", error);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [syncing, setCart]);

  const handleIncrease = useCallback(
    async (product: CartProduct) => {
      const previousQuantity = product.quantity;

      updateQuantity(product.id, previousQuantity + 1);
      setBusy(product.id);

      try {
        await cartService.addToCart(product.id, 1);
        toast.success("Item adicionado", { position: "top-right" });
      } catch {
        updateQuantity(product.id, previousQuantity);
        toast.error("Falha ao aumentar quantidade", { position: "top-right" });
      } finally {
        setBusy(null);
      }
    },
    [updateQuantity],
  );

  const handleDecrease = useCallback(
    async (product: CartProduct) => {
      if (product.quantity <= 1) return;

      const previousQuantity = product.quantity;

      updateQuantity(product.id, previousQuantity - 1);
      setBusy(product.id);

      try {
        await cartService.decreaseQuantity(product.id, 1);
        toast.success("Item foi removido", { position: "top-right" });
      } catch {
        updateQuantity(product.id, previousQuantity);
        toast.error("Falha ao reduzir quantidade", { position: "top-right" });
      } finally {
        setBusy(null);
      }
    },
    [updateQuantity],
  );

  const handleRemove = useCallback(
    async (product: CartProduct) => {
      const previousItems = [...cart.items];

      removeItem(product.id);
      setBusy(product.id);

      try {
        await cartService.removeFromCart(product.id);
        toast.success("O produto removido", { position: "top-right" });
      } catch {
        setCart({
          items: previousItems,
          total: previousItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          ),
        });
        toast.error("Falha ao remover produto", { position: "top-right" });
      } finally {
        setBusy(null);
      }
    },
    [cart.items, removeItem, setCart],
  );

  const handleReload = useCallback(async () => {
    setSyncing(true);
    try {
      const freshCart = await cartService.fetchCart();
      setCart(freshCart);
    } catch {
      toast.error("Falha ao atualizar carrinho", { position: "top-right" });
    } finally {
      setSyncing(false);
    }
  }, [setCart]);

  const hasItems = cart.items.length > 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border">
        {syncing ? (
          <div className="p-6 animate-pulse">
            <div className="h-6 w-40 rounded bg-slate-200" />
            <div className="mt-4 grid gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border p-3"
                >
                  <div className="h-20 w-20 rounded bg-slate-200" />
                  <div className="flex-1">
                    <div className="h-4 w-3/5 rounded bg-slate-200" />
                    <div className="mt-2 h-4 w-24 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : hasItems ? (
          <ul role="list" className="divide-y">
            {cart.items.map((product) => (
              <li key={product.id} className="flex items-start gap-4 p-4">
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
                      onClick={() => handleDecrease(product)}
                      disabled={busy === product.id || product.quantity <= 1}
                      aria-label="Diminuir quantidade"
                      className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
                    >
                      −
                    </button>
                    <span
                      aria-live="polite"
                      className="w-8 text-center text-sm"
                    >
                      {product.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleIncrease(product)}
                      disabled={busy === product.id}
                      aria-label="Aumentar quantidade"
                      className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
                    >
                      +
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemove(product)}
                      disabled={busy === product.id}
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
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <p className="text-slate-700">Seu carrinho está vazio.</p>
            <button
              type="button"
              onClick={handleReload}
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
            disabled={!hasItems}
            className="w-full rounded-xl bg-brand-800 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-50"
          >
            Finalizar compra
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Valores de frete e cálculo de prazo são exibidos na próxima etapa.
        </p>
      </div>
    </div>
  );
}
