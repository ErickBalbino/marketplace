import type { Cart } from "@/types/cart";

const requestCache = new Map<string, Promise<Cart>>();

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
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
  const cacheKey = `add-${productId}-${quantity}`;

  if (!requestCache.has(cacheKey)) {
    requestCache.set(
      cacheKey,
      (async () => {
        try {
          const response = await fetchWithAuth("/api/cart/add-product", {
            method: "POST",
            body: JSON.stringify({ productId, quantity }),
          });

          const cart = await response.json();

          return {
            items: cart.items || [],
            total: cart.total || 0,
          };
        } finally {
          setTimeout(() => requestCache.delete(cacheKey), 1000);
        }
      })(),
    );
  }

  return requestCache.get(cacheKey)!;
}

export async function removeFromCart(productId: string): Promise<Cart> {
  const cacheKey = `remove-${productId}`;

  if (!requestCache.has(cacheKey)) {
    requestCache.set(
      cacheKey,
      (async () => {
        try {
          const response = await fetchWithAuth("/api/cart/remove-product", {
            method: "DELETE",
            body: JSON.stringify({ productId }),
          });

          const cart = await response.json();
          return {
            items: cart.items || [],
            total: cart.total || 0,
          };
        } finally {
          setTimeout(() => requestCache.delete(cacheKey), 1000);
        }
      })(),
    );
  }

  return requestCache.get(cacheKey)!;
}

export async function decreaseQuantity(
  productId: string,
  quantity: number,
): Promise<Cart> {
  const cacheKey = `decrease-${productId}-${quantity}`;

  if (!requestCache.has(cacheKey)) {
    requestCache.set(
      cacheKey,
      (async () => {
        try {
          const response = await fetchWithAuth("/api/cart/decrease-quantity", {
            method: "PATCH",
            body: JSON.stringify({ productId, quantity }),
          });

          const cart = await response.json();
          return {
            items: cart.items || [],
            total: cart.total || 0,
          };
        } finally {
          setTimeout(() => requestCache.delete(cacheKey), 1000);
        }
      })(),
    );
  }

  return requestCache.get(cacheKey)!;
}

export async function fetchCart(): Promise<Cart> {
  const cacheKey = "fetch-cart";

  if (!requestCache.has(cacheKey)) {
    requestCache.set(
      cacheKey,
      (async () => {
        try {
          const authRes = await fetch("/api/auth/status", {
            cache: "no-store",
          });

          if (!authRes.ok) {
            return { items: [], total: 0 };
          }

          const response = await fetchWithAuth("/api/cart");
          const cart = await response.json();

          return {
            items: cart.items || [],
            total: cart.total || 0,
          };
        } finally {
          setTimeout(() => requestCache.delete(cacheKey), 2000);
        }
      })(),
    );
  }

  return requestCache.get(cacheKey)!;
}

export const cartService = {
  addToCart,
  removeFromCart,
  decreaseQuantity,
  fetchCart,
};
