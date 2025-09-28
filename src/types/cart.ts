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

export type CartAction =
  | { type: "SET_CART"; payload: Cart }
  | { type: "ADD_ITEM"; payload: CartProduct }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };
