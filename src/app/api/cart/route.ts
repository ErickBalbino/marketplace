import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import { mapCartResponse } from "@/services/cart/shared";
import type { CartProduct } from "@/types/cart";

export async function GET() {
  try {
    const res = await api("/cart", {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      const status = res.status;
      const payload =
        status === 401 || status === 403
          ? { items: [] as CartProduct[], total: 0, authRequired: true }
          : { items: [] as CartProduct[], total: 0 };
      return NextResponse.json(payload, { status });
    }

    const json = await res.json();
    const cart = mapCartResponse(json);

    // Garantir que o carrinho sempre tenha uma estrutura válida
    return NextResponse.json({
      items: cart.items || [],
      total: cart.total || 0,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ items: [], total: 0 }, { status: 500 });
  }
}
