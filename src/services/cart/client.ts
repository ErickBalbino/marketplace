import type { Cart } from "@/types/cart";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 401 || response.status === 403) {
    const error = new Error("Authentication required");
    error.message = `auth-required: ${response.status}`;
    throw error;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

export async function addToCart(
  productId: string,
  quantity: number,
): Promise<Cart> {
  const response = await fetchWithAuth("/api/cart/add-product", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });

  return await response.json();
}

export async function removeFromCart(productId: string): Promise<Cart> {
  const response = await fetchWithAuth("/api/cart/remove-product", {
    method: "DELETE",
    body: JSON.stringify({ productId }),
  });

  return await response.json();
}

export async function decreaseQuantity(
  productId: string,
  quantity: number,
): Promise<Cart> {
  const response = await fetchWithAuth("/api/cart/decrease-quantity", {
    method: "PATCH",
    body: JSON.stringify({ productId, quantity }),
  });

  return await response.json();
}

export async function fetchCart(): Promise<Cart> {
  const response = await fetchWithAuth("/api/cart");
  return await response.json();
}

export const cartService = {
  addToCart,
  removeFromCart,
  decreaseQuantity,
  fetchCart,
};
