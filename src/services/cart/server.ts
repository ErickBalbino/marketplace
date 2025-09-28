import { cookies } from "next/headers";
import type { Cart } from "@/types/cart";
import { mapCartResponse } from "./shared";

export async function getServerCart(): Promise<Cart> {
  const token = (await cookies()).get("auth_token")?.value ?? "";

  const res = await fetch(
    `${process.env.API_BASE_URL ?? "http://localhost:3001"}/cart`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    if (res.status === 404) return { items: [], total: 0 };
    return { items: [], total: 0 };
  }
  return mapCartResponse(await res.json());
}
