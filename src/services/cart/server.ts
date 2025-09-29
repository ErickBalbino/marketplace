import { cookies } from "next/headers";
import type { Cart } from "@/types/cart";
import { mapCartResponse } from "./shared";

export async function getServerCart(): Promise<Cart> {
  const token = (await cookies()).get("auth_token")?.value ?? "";

  try {
    const res = await fetch(
      `${process.env.API_BASE_URL ?? "http://localhost:3001"}/cart`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      console.warn(`Failed to fetch cart: ${res.status} ${res.statusText}`);
      return { items: [], total: 0 };
    }

    const json = await res.json();
    return mapCartResponse(json);
  } catch (error) {
    console.error("Error fetching server cart:", error);
    return { items: [], total: 0 };
  }
}
