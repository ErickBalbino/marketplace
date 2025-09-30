/* eslint-disable @typescript-eslint/no-explicit-any */
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
  | { type: "OPTIMISTIC_UPDATE_START"; payload: { id: string; type: string } }
  | { type: "OPTIMISTIC_UPDATE_END"; payload: { id: string } };

interface CartState {
  cart: Cart;
  isLoading: boolean;
  isInitialized: boolean;
  optimisticUpdates: Map<string, string>;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
        isLoading: false,
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_INITIALIZED":
      return { ...state, isInitialized: action.payload };

    case "OPTIMISTIC_UPDATE_START":
      const newUpdates = new Map(state.optimisticUpdates);
      newUpdates.set(action.payload.id, action.payload.type);
      return {
        ...state,
        optimisticUpdates: newUpdates,
        isLoading: true,
      };

    case "OPTIMISTIC_UPDATE_END":
      const updates = new Map(state.optimisticUpdates);
      updates.delete(action.payload.id);
      return {
        ...state,
        optimisticUpdates: updates,
        isLoading: updates.size > 0,
      };

    default:
      return state;
  }
}

const globalCartCache = {
  current: { items: [], total: 0 } as Cart,
  listeners: new Set<() => void>(),
  update(cart: Cart) {
    this.current = cart;
    this.listeners.forEach((listener) => listener());
  },
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
};

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
    optimisticUpdates: new Map(),
  });

  const operationQueue = useRef<Map<string, Promise<any>>>(new Map());
  const isMounted = useRef(true);

  useEffect(() => {
    globalCartCache.update(initialCart);

    const unsubscribe = globalCartCache.subscribe(() => {
      if (isMounted.current && !state.isLoading) {
        dispatch({ type: "SET_CART", payload: globalCartCache.current });
      }
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const initializeCart = async () => {
      if (state.isInitialized) return;

      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const serverCart = await cartService.fetchCart();

        if (isMounted.current) {
          globalCartCache.update(serverCart);
          dispatch({ type: "SET_CART", payload: serverCart });
          dispatch({ type: "SET_INITIALIZED", payload: true });
        }
      } catch (error) {
        console.error("Failed to initialize cart:", error);
        if (isMounted.current) {
          dispatch({ type: "SET_CART", payload: initialCart });
          dispatch({ type: "SET_INITIALIZED", payload: true });
        }
      } finally {
        if (isMounted.current) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      }
    };

    initializeCart();
  }, [initialCart, state.isInitialized]);

  const refreshCart = useCallback(async (): Promise<void> => {
    try {
      const cart = await cartService.fetchCart();
      if (isMounted.current) {
        globalCartCache.update(cart);
        dispatch({ type: "SET_CART", payload: cart });
      }
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    }
  }, []);

  const executeWithQueue = useCallback(
    async <T,>(
      operationId: string,
      operation: () => Promise<T>,
    ): Promise<T> => {
      const existingOperation = operationQueue.current.get(operationId);
      if (existingOperation) {
        await existingOperation;
      }

      const operationPromise = (async () => {
        try {
          return await operation();
        } finally {
          operationQueue.current.delete(operationId);
        }
      })();

      operationQueue.current.set(operationId, operationPromise);
      return operationPromise;
    },
    [],
  );

  const addItem = useCallback(
    (
      productId: string,
      productData?: Partial<Cart["items"][0]>,
      quantity: number = 1,
    ): Promise<void> => {
      return executeWithQueue(`add-${productId}`, async (): Promise<void> => {
        const operationId = `${productId}-${Date.now()}`;

        try {
          dispatch({
            type: "OPTIMISTIC_UPDATE_START",
            payload: { id: operationId, type: "add" },
          });

          await cartService.addToCart(productId, quantity);
          await refreshCart();
        } catch (error) {
          console.error("Add item failed:", error);
          await refreshCart();
          throw error;
        } finally {
          if (isMounted.current) {
            dispatch({
              type: "OPTIMISTIC_UPDATE_END",
              payload: { id: operationId },
            });
          }
        }
      });
    },
    [executeWithQueue, refreshCart],
  );

  const removeItem = useCallback(
    (productId: string): Promise<void> => {
      return executeWithQueue(
        `remove-${productId}`,
        async (): Promise<void> => {
          const operationId = `${productId}-${Date.now()}`;

          try {
            dispatch({
              type: "OPTIMISTIC_UPDATE_START",
              payload: { id: operationId, type: "remove" },
            });

            await cartService.removeFromCart(productId);
            await refreshCart();
          } catch (error) {
            console.error("Remove item failed:", error);
            await refreshCart();
            throw error;
          } finally {
            if (isMounted.current) {
              dispatch({
                type: "OPTIMISTIC_UPDATE_END",
                payload: { id: operationId },
              });
            }
          }
        },
      );
    },
    [executeWithQueue, refreshCart],
  );

  const increaseQuantity = useCallback(
    (productId: string): Promise<void> => {
      return executeWithQueue(
        `increase-${productId}`,
        async (): Promise<void> => {
          const item = state.cart.items.find((item) => item.id === productId);
          if (!item) {
            throw new Error("Item not found in cart");
          }

          await addItem(productId, item, 1);
        },
      );
    },
    [executeWithQueue, addItem, state.cart.items],
  );

  const decreaseQuantity = useCallback(
    (productId: string): Promise<void> => {
      return executeWithQueue(
        `decrease-${productId}`,
        async (): Promise<void> => {
          const item = state.cart.items.find((item) => item.id === productId);
          if (!item) {
            throw new Error("Item not found in cart");
          }

          const operationId = `${productId}-${Date.now()}`;

          try {
            dispatch({
              type: "OPTIMISTIC_UPDATE_START",
              payload: { id: operationId, type: "decrease" },
            });

            await cartService.decreaseQuantity(productId, 1);
            await refreshCart();
          } catch (error) {
            console.error("Decrease quantity failed:", error);
            await refreshCart();
            throw error;
          } finally {
            if (isMounted.current) {
              dispatch({
                type: "OPTIMISTIC_UPDATE_END",
                payload: { id: operationId },
              });
            }
          }
        },
      );
    },
    [executeWithQueue, refreshCart, state.cart.items],
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
