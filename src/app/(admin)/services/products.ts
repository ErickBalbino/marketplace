import { api } from "@/lib/api";
import { resolveImageSrc } from "@/lib/images";
import type { Product } from "@/types/product";

export type ListParams = { page?: number; limit?: number; q?: string };

export async function adminListProducts(params: ListParams) {
  const sp = new URLSearchParams();
  if (params.page) sp.set("page", String(params.page));
  if (params.limit) sp.set("limit", String(params.limit));
  if (params.q) sp.set("q", params.q);

  const res = await api(`/products?${sp.toString()}`, { method: "GET" });
  if (!res.ok) throw new Error("Falha ao listar produtos");
  const json = await res.json();

  const products: Product[] = (json?.products ?? json?.data ?? []).map(
    (p: Product) => ({
      id: String(p.id),
      name: String(p.name),
      description: String(p.description ?? ""),
      imageUrl: resolveImageSrc(p.imageUrl),
      price: Number(p.price ?? 0),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }),
  );

  return {
    products,
    page: Number(json?.page ?? 1),
    limit: Number(json?.limit ?? products.length),
    total: Number(json?.total ?? products.length),
  };
}

export async function adminCreateProduct(formData: FormData): Promise<Product> {
  const res = await fetch("/api/admin/products", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Falha ao criar produto: ${errorText}`);
  }

  const p = await res.json();
  return {
    id: String(p.id),
    name: String(p.name),
    description: String(p.description ?? ""),
    imageUrl: resolveImageSrc(p.imageUrl),
    price: Number(p.price ?? 0),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export async function adminUpdateProduct(
  id: string,
  fd: FormData,
): Promise<Product> {
  const res = await api(`/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: fd,
  });
  if (!res.ok) throw new Error("Falha ao atualizar produto");
  const p = await res.json();
  return {
    id: String(p.id),
    name: String(p.name),
    description: String(p.description ?? ""),
    imageUrl: resolveImageSrc(p.imageUrl),
    price: Number(p.price ?? 0),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export async function adminDeleteProduct(id: string): Promise<Product> {
  const res = await api(`/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Falha ao deletar produto");
  const json = await res.json();
  const p = json.product ?? json;
  return {
    id: String(p.id),
    name: String(p.name),
    description: String(p.description ?? ""),
    imageUrl: resolveImageSrc(p.imageUrl),
    price: Number(p.price ?? 0),
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}
