"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { brl } from "@/utils/formatCurrency";
import { Cart } from "@/types/cart";
import Link from "next/link";

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
  const [loadingOperations, setLoadingOperations] = useState<Set<string>>(
    new Set(),
  );

  if (!isInitialized) {
    return <CartSkeleton />;
  }

  const handleOperation = async (
    operationId: string,
    operation: () => Promise<void>,
  ) => {
    if (loadingOperations.has(operationId)) return;

    setLoadingOperations((prev) => new Set(prev).add(operationId));

    try {
      await operation();
    } catch (error) {
      console.error("Operation failed:", error);
      toast.error("Erro ao atualizar carrinho. Tentando recuperar...");

      try {
        await refreshCart();
      } catch (refreshError) {
        console.error("Failed to refresh cart:", refreshError);
      }
    } finally {
      setLoadingOperations((prev) => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
    }
  };

  const handleIncrease = async (productId: string) => {
    await handleOperation(`increase-${productId}`, () =>
      increaseQuantity(productId),
    );
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

    await handleOperation(`decrease-${productId}`, () =>
      decreaseQuantity(productId),
    );
  };

  const handleRemove = async (productId: string, productName: string) => {
    await handleOperation(`remove-${productId}`, async () => {
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
              const isIncreasing = loadingOperations.has(
                `increase-${product.id}`,
              );
              const isDecreasing = loadingOperations.has(
                `decrease-${product.id}`,
              );
              const isRemoving = loadingOperations.has(`remove-${product.id}`);
              const isItemLoading = isIncreasing || isDecreasing || isRemoving;

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

                  <ProductImage
                    imageUrl={product.imageUrl}
                    name={product.name}
                  />

                  <ProductInfo
                    product={product}
                    onIncrease={handleIncrease}
                    onDecrease={handleDecrease}
                    onRemove={handleRemove}
                    isItemLoading={isItemLoading}
                  />

                  <ProductTotal product={product} />
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyCart refreshCart={refreshCart} />
        )}
      </div>

      <CartSummary cart={cart} isLoading={isLoading} hasItems={hasItems} />
    </div>
  );
}

function ProductImage({ imageUrl, name }: { imageUrl?: string; name: string }) {
  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-50">
      <Image
        src={imageUrl || "/next.svg"}
        alt={name}
        fill
        sizes="80px"
        className="object-contain p-2"
      />
    </div>
  );
}

function ProductInfo({
  product,
  onIncrease,
  onDecrease,
  onRemove,
  isItemLoading,
}: {
  product: Cart["items"][0];
  onIncrease: (id: string, name: string) => void;
  onDecrease: (id: string, name: string, quantity: number) => void;
  onRemove: (id: string, name: string) => void;
  isItemLoading: boolean;
}) {
  return (
    <div className="min-w-0 flex-1">
      <h3 className="truncate font-medium">{product.name}</h3>
      <p className="mt-1 text-sm text-slate-600">{brl(product.price)}</p>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onDecrease(product.id, product.name, product.quantity)}
          disabled={isItemLoading || product.quantity <= 1}
          aria-label="Diminuir quantidade"
          className="rounded-md border px-2 py-1 text-sm disabled:opacity-50 hover:bg-slate-50"
        >
          −
        </button>
        <span className="w-8 text-center text-sm">{product.quantity}</span>
        <button
          type="button"
          onClick={() => onIncrease(product.id, product.name)}
          disabled={isItemLoading}
          aria-label="Aumentar quantidade"
          className="rounded-md border px-2 py-1 text-sm disabled:opacity-50 hover:bg-slate-50"
        >
          +
        </button>

        <button
          type="button"
          onClick={() => onRemove(product.id, product.name)}
          disabled={isItemLoading}
          className="ml-3 rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
        >
          Remover
        </button>
      </div>
    </div>
  );
}

function ProductTotal({ product }: { product: Cart["items"][0] }) {
  return (
    <div className="text-right font-semibold">
      {brl(product.price * product.quantity)}
    </div>
  );
}

function CartSkeleton() {
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

function EmptyCart({ refreshCart }: { refreshCart: () => Promise<void> }) {
  return (
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
  );
}

function CartSummary({
  cart,
  isLoading,
  hasItems,
}: {
  cart: Cart;
  isLoading: boolean;
  hasItems: boolean;
}) {
  return (
    <div className="rounded-2xl border p-5">
      <h2 className="text-lg font-semibold">Resumo</h2>
      <div className="mt-3 flex items-center justify-between text-sm text-slate-700">
        <span>Subtotal</span>
        <span>{brl(cart.total)}</span>
      </div>

      <div className="mt-6">
        <button
          type="button"
          disabled={!hasItems || isLoading}
          className="w-full rounded-xl bg-brand-800 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-50"
        >
          <Link href="/carrinho/endereco" className="block w-full text-center">
            Prosseguir
          </Link>
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Valores de frete e cálculo de prazo são exibidos na próxima etapa.
      </p>
    </div>
  );
}
