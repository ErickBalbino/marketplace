"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";

export function CartIcon() {
  const { cart, isLoading } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isLoading) {
    return (
      <div className="inline-flex items-center rounded-md p-2 relative transition-colors">
        <ShoppingCart size={22} className="opacity-50" />
      </div>
    );
  }

  const itemCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <Link
      href="/carrinho"
      className="inline-flex items-center rounded-md p-2 hover:bg-slate-100 relative transition-colors"
      aria-label={`Carrinho de compras com ${itemCount} itens`}
    >
      <ShoppingCart size={22} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}
