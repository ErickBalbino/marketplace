import { NextResponse } from "next/server";
import { api } from "@/lib/api";

type RawProduct = {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  createdAt?: string;
  updatedAt?: string;
};

type ListResponse = {
  products?: RawProduct[];
  data?: RawProduct[];
  page?: number;
  limit?: number;
  total?: number;
};

export const revalidate = 0;

export async function GET() {
  // Tenta puxar até ~500 produtos (ajuste se precisar)
  const pageSize = 100;
  const maxPages = 5;

  const all: RawProduct[] = [];
  for (let page = 1; page <= maxPages; page++) {
    const res = await api(`/products?page=${page}&limit=${pageSize}`, {
      method: "GET",
    });
    if (!res.ok) {
      if (page === 1) {
        return NextResponse.json({ products: [] }, { status: 200 });
      }
      break;
    }
    const json = (await res.json()) as ListResponse;
    const list = json.products ?? json.data ?? [];
    all.push(...list);
    const total = Number(json.total ?? list.length);
    if (all.length >= total || list.length < pageSize) break;
  }

  const products = all.map((p) => ({
    id: String(p.id),
    name: String(p.name ?? p.title ?? "Produto"),
    description: String(p.description ?? ""),
    imageUrl: String(p.imageUrl ?? ""),
    price: Number(p.price ?? 0),
  }));

  return NextResponse.json({ products });
}
