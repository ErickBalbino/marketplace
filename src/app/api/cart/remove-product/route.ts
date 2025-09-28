import { NextResponse } from "next/server";
import { api } from "@/lib/api";
import { mapCartResponse } from "@/services/cart/shared";
import type { Cart } from "@/types/cart";

type RemoveBody = { productId: string };

export async function DELETE(req: Request) {
  const body: RemoveBody = await req.json();

  const res = await api("/cart/remove-product", {
    method: "DELETE",
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
