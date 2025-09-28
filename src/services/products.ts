import { api } from "@/lib/api";
import { Product } from "@/types/Product";

export type ProductsPage = {
  page: number;
  limit: number;
  total: number;
  products: Product[];
};

export async function fetchProducts(opts: {
  page: number;
  limit: number;
  q?: string;
}) {
  const params = new URLSearchParams();
  params.set("page", String(opts.page));
  params.set("limit", String(opts.limit));
  if (opts.q) {
    params.set("name", opts.q);
    params.set("description", opts.q);
  }

  const res = await api(`/products?${params.toString()}`, {
    cache: "force-cache",
    next: {
      revalidate: 30,
    },
  });

  if (!res.ok) throw new Error("Falha ao buscar produtos");
  const data = (await res.json()) as ProductsPage;

  return data;
}
