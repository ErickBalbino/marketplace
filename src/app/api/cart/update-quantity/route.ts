// app/api/cart/update-quantity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json();
    const token = (await cookies()).get("auth_token")?.value;

    const response = await fetch(
      `${process.env.API_BASE_URL}/cart/items/${productId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ quantity }),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to update quantity" },
        { status: response.status },
      );
    }

    const cart = await response.json();
    return NextResponse.json(cart);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
