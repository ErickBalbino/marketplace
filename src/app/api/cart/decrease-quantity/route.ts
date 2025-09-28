import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import { mapCartResponse } from "@/services/cart/shared";
import type { Cart } from "@/types/cart";

type DecreaseBody = { productId: string; quantity: number };

export async function PATCH(req: Request) {
  const body: DecreaseBody = await req.json();

  const res = await api("/cart/decrease-quantity", {
    method: "PATCH",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ items: [], total: 0 } satisfies Cart, {
      status: res.status,
    });
  }

  const json = await res.json();
  return NextResponse.json(mapCartResponse(json));
}
