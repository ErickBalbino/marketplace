import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import { mapCartResponse } from "@/services/cart/shared";
import type { Cart } from "@/types/cart";

type AddBody = { productId: string; quantity: number };

export async function POST(req: Request) {
  const body: AddBody = await req.json();

  const res = await api("/cart/add-product", {
    method: "POST",
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
