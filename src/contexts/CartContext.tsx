"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Cart } from "@/types/cart";
import { cartService } from "@/services/cart/client";

interface CartContextType {
  cart: Cart;
  isLoading: boolean;
  isInitialized: boolean;
  addItem: (
    productId: string,
    productData?: Partial<Cart["items"][0]>,
    quantity?: number,
  ) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: "SET_CART"; payload: Cart }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_INITIALIZED"; payload: boolean }
  | {
      type: "ADD_ITEM_OPTIMISTIC";
      payload: {
        productId: string;
        productData?: Partial<Cart["items"][0]>;
        quantity: number;
      };
    }
  | { type: "REMOVE_ITEM_OPTIMISTIC"; payload: string }
  | {
      type: "UPDATE_QUANTITY_OPTIMISTIC";
      payload: { productId: string; quantity: number };
    };

function cartReducer(
  state: {
    cart: Cart;
    isLoading: boolean;
    isInitialized: boolean;
  },
  action: CartAction,
): { cart: Cart; isLoading: boolean; isInitialized: boolean } {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
        isInitialized: true,
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_INITIALIZED":
      return { ...state, isInitialized: action.payload };

    case "ADD_ITEM_OPTIMISTIC": {
      const { productId, productData, quantity } = action.payload;
      const existingItem = state.cart.items.find(
        (item) => item.id === productId,
      );

      let newItems;
      if (existingItem) {
        newItems = state.cart.items.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        const newItem = {
          id: productId,
          name: productData?.name || "Produto",
          price: productData?.price || 0,
          imageUrl: productData?.imageUrl || "",
          quantity: quantity,
        };
        newItems = [...state.cart.items, newItem];
      }

      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      return {
        ...state,
        cart: { items: newItems, total: newTotal },
      };
    }

    case "REMOVE_ITEM_OPTIMISTIC": {
      const newItems = state.cart.items.filter(
        (item) => item.id !== action.payload,
      );
      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      return {
        ...state,
        cart: { items: newItems, total: newTotal },
      };
    }

    case "UPDATE_QUANTITY_OPTIMISTIC": {
      const { productId, quantity } = action.payload;
      const newItems = state.cart.items
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item,
        )
        .filter((item) => item.quantity > 0);

      const newTotal = newItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      return {
        ...state,
        cart: { items: newItems, total: newTotal },
      };
    }

    default:
      return state;
  }
}

export function CartProvider({
  children,
  initialCart,
}: {
  children: React.ReactNode;
  initialCart: Cart;
}) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: initialCart,
    isLoading: false,
    isInitialized: false,
  });

  const operationInProgress = useRef(false);

  useEffect(() => {
    const initializeCart = async () => {
      if (operationInProgress.current) return;
      operationInProgress.current = true;

      try {
        dispatch({ type: "SET_LOADING", payload: true });

        const serverCart = await cartService.fetchCart();
        dispatch({ type: "SET_CART", payload: serverCart });
      } catch (error) {
        console.error("Failed to initialize cart:", error);
        dispatch({ type: "SET_CART", payload: initialCart });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
        operationInProgress.current = false;
      }
    };

    initializeCart();
  }, [initialCart]);

  const refreshCart = useCallback(async () => {
    if (operationInProgress.current || !state.isInitialized) return;

    try {
      const cart = await cartService.fetchCart();
      dispatch({ type: "SET_CART", payload: cart });
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    }
  }, [state.isInitialized]);

  useEffect(() => {
    if (!state.isInitialized) return;

    const interval = setInterval(() => {
      refreshCart();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshCart, state.isInitialized]);

  const addItem = useCallback(
    async (
      productId: string,
      productData?: Partial<Cart["items"][0]>,
      quantity: number = 1,
    ) => {
      if (operationInProgress.current) {
        throw new Error("Operação em andamento");
      }

      operationInProgress.current = true;

      const previousCart = state.cart;

      dispatch({
        type: "ADD_ITEM_OPTIMISTIC",
        payload: { productId, productData, quantity },
      });

      try {
        const serverCart = await cartService.addToCart(productId, quantity);
        dispatch({ type: "SET_CART", payload: serverCart });
      } catch (error) {
        dispatch({ type: "SET_CART", payload: previousCart });
        throw error;
      } finally {
        operationInProgress.current = false;
      }
    },
    [state.cart],
  );

  const removeItem = useCallback(
    async (productId: string) => {
      if (operationInProgress.current) {
        throw new Error("Operação em andamento");
      }

      operationInProgress.current = true;

      const previousCart = state.cart;

      dispatch({ type: "REMOVE_ITEM_OPTIMISTIC", payload: productId });

      try {
        const serverCart = await cartService.removeFromCart(productId);
        dispatch({ type: "SET_CART", payload: serverCart });
      } catch (error) {
        dispatch({ type: "SET_CART", payload: previousCart });
        throw error;
      } finally {
        operationInProgress.current = false;
      }
    },
    [state.cart],
  );

  const increaseQuantity = useCallback(
    async (productId: string) => {
      const item = state.cart.items.find((item) => item.id === productId);
      if (!item) return;

      await addItem(productId, item, 1);
    },
    [addItem, state.cart.items],
  );

  const decreaseQuantity = useCallback(
    async (productId: string) => {
      if (operationInProgress.current) return;
      operationInProgress.current = true;

      const item = state.cart.items.find((item) => item.id === productId);
      if (!item) return;

      const previousCart = state.cart;
      const newQuantity = item.quantity - 1;

      if (newQuantity <= 0) {
        await removeItem(productId);
        return;
      }

      dispatch({
        type: "UPDATE_QUANTITY_OPTIMISTIC",
        payload: { productId, quantity: newQuantity },
      });

      try {
        const serverCart = await cartService.decreaseQuantity(productId, 1);
        dispatch({ type: "SET_CART", payload: serverCart });
      } catch (error) {
        dispatch({ type: "SET_CART", payload: previousCart });
        throw error;
      } finally {
        operationInProgress.current = false;
      }
    },
    [removeItem, state.cart],
  );

  const value: CartContextType = {
    cart: state.cart,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    addItem,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
