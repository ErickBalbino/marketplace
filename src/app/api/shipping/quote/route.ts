import { NextResponse } from "next/server";
import type { ShippingQuoteRequest } from "@/types/Shipping";
import { quoteShipping } from "@/services/shipping";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ShippingQuoteRequest;
    if (
      !body?.destinationCep ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const payload = await quoteShipping(body.destinationCep, body.items);
    return NextResponse.json(payload, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao calcular frete" },
      { status: 500 },
    );
  }
}
