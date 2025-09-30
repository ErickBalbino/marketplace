"use client";

import { FavoriteProduct, FavoritesState } from "@/types/favorites";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";

interface FavoritesContextType {
  favorites: FavoriteProduct[];
  isInitialized: boolean;
  addFavorite: (product: Omit<FavoriteProduct, "addedAt">) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: Omit<FavoriteProduct, "addedAt">) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

type FavoritesAction =
  | { type: "SET_FAVORITES"; payload: FavoriteProduct[] }
  | { type: "ADD_FAVORITE"; payload: FavoriteProduct }
  | { type: "REMOVE_FAVORITE"; payload: string }
  | { type: "CLEAR_FAVORITES" }
  | { type: "SET_INITIALIZED"; payload: boolean };

function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction,
): FavoritesState {
  switch (action.type) {
    case "SET_FAVORITES":
      return { ...state, items: action.payload };
    case "ADD_FAVORITE":
      return {
        ...state,
        items: [
          ...state.items.filter((item) => item.id !== action.payload.id),
          action.payload,
        ],
      };
    case "REMOVE_FAVORITE":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "CLEAR_FAVORITES":
      return { ...state, items: [] };
    case "SET_INITIALIZED":
      return { ...state, isInitialized: action.payload };
    default:
      return state;
  }
}

const initialState: FavoritesState = {
  items: [],
  isInitialized: false,
};

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("marketplace_favorites");
      if (stored) {
        const favorites = JSON.parse(stored);
        dispatch({ type: "SET_FAVORITES", payload: favorites });
      }
    } catch (error) {
      console.error("Failed to load favorites from localStorage:", error);
    } finally {
      dispatch({ type: "SET_INITIALIZED", payload: true });
    }
  }, []);

  useEffect(() => {
    if (!state.isInitialized) return;

    try {
      localStorage.setItem(
        "marketplace_favorites",
        JSON.stringify(state.items),
      );
    } catch (error) {
      console.error("Failed to save favorites to localStorage:", error);
    }
  }, [state.items, state.isInitialized]);

  const addFavorite = useCallback(
    (product: Omit<FavoriteProduct, "addedAt">) => {
      const favoriteProduct: FavoriteProduct = {
        ...product,
        addedAt: new Date().toISOString(),
      };
      dispatch({ type: "ADD_FAVORITE", payload: favoriteProduct });
    },
    [],
  );

  const removeFavorite = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: productId });
  }, []);

  const toggleFavorite = useCallback(
    (product: Omit<FavoriteProduct, "addedAt">) => {
      const isCurrentlyFavorite = state.items.some(
        (item) => item.id === product.id,
      );
      if (isCurrentlyFavorite) {
        removeFavorite(product.id);
      } else {
        addFavorite(product);
      }
    },
    [state.items, addFavorite, removeFavorite],
  );

  const isFavorite = useCallback(
    (productId: string) => {
      return state.items.some((item) => item.id === productId);
    },
    [state.items],
  );

  const clearFavorites = useCallback(() => {
    dispatch({ type: "CLEAR_FAVORITES" });
  }, []);

  const value: FavoritesContextType = {
    favorites: state.items,
    isInitialized: state.isInitialized,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
