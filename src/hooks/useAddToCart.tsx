"use client";

import { useCallback } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export function useAddToCart() {
  const { addItem, isInitialized } = useCart();

  const handleAddToCart = useCallback(
    async (
      productId: string,
      productName: string,
      productPrice: number,
      productImage?: string,
      quantity: number = 1,
    ) => {
      if (!isInitialized) {
        toast.error(
          "Sistema de carrinho ainda não está pronto. Tente novamente em instantes.",
        );
        return false;
      }

      try {
        const productData = {
          name: productName,
          price: productPrice,
          imageUrl: productImage || "",
        };

        await addItem(productId, productData, quantity);
        toast.success(`${productName} adicionado ao carrinho!`, {
          position: "top-right",
          duration: 3000,
        });
        return true;
      } catch (error) {
        console.error("Error adding to cart:", error);

        if (error instanceof Error && error.message.includes("401")) {
          toast.error("Sua sessão expirou. Faça login novamente.");
        } else {
          toast.error("Falha ao adicionar produto ao carrinho");
        }
        return false;
      }
    },
    [addItem, isInitialized],
  );

  return {
    handleAddToCart,
  };
}
