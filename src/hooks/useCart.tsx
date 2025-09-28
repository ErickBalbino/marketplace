"use client";

import { useReducer, useCallback } from "react";
import { Cart, CartProduct, CartAction } from "@/types/cart";

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "SET_CART":
      return action.payload;

    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item,
        );
        return {
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          ),
        };
      } else {
        const updatedItems = [...state.items, action.payload];
        return {
          items: updatedItems,
          total: updatedItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          ),
        };
      }
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item,
        )
        .filter((item) => item.quantity > 0);

      return {
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
      };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload,
      );
      return {
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        ),
      };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default:
      return state;
  }
}

export function useCart(initialCart: Cart) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  const setCart = useCallback((newCart: Cart) => {
    dispatch({ type: "SET_CART", payload: newCart });
  }, []);

  const addItem = useCallback((product: CartProduct) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  return {
    cart,
    setCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
