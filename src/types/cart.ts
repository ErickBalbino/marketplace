export interface CartProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface Cart {
  items: CartProduct[];
  total: number;
}

export interface CartState {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
}

export type CartAction =
  | { type: "SET_CART"; payload: Cart }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "ADD_ITEM"; payload: CartProduct }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };
