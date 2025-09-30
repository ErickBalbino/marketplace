"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminHeader } from "../../_components/Header";
import { ProductAdminCard } from "../../_components/ProductCard";
import { EditProductModal } from "../../_components/EditProductModal";
import { ConfirmDialog } from "../../_components/ConfirmDialog";
import type { Product } from "@/types/product";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { CreateProduct } from "../../_components/CreateProduct";

type ListResponse = {
  products: Product[];
  page: number;
  limit: number;
  total: number;
};

export default function AdminProductsPage() {
  const [q, setQ] = useState("");
  const [data, setData] = useState<ListResponse>({
    products: [],
    page: 1,
    limit: 12,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const [creating, setCreating] = useState<boolean | null>(null);

  const filtered = useMemo(() => {
    if (!q.trim()) return data.products;
    const t = q.toLowerCase();
    return data.products.filter(
      (p) => (p.name && p.name.toLowerCase().includes(t)) || p.id.includes(q),
    );
  }, [data.products, q]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?page=1&limit=60`);
      const json = (await res.json()) as ListResponse;
      setData(json);
    } catch {
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSaved(p: Product) {
    const isNewProduct = !data.products.some((product) => product.id === p.id);

    if (isNewProduct) {
      toast.success("Produto criado com sucesso!");
      setData((prev) => ({
        ...prev,
        products: [p, ...prev.products],
        total: prev.total + 1,
      }));
    } else {
      toast.success("Produto atualizado com sucesso!");
      setData((prev) => ({
        ...prev,
        products: prev.products.map((it) =>
          it.id === p.id
            ? {
                ...p,
                imageUrl: p.imageUrl?.startsWith("/")
                  ? p.imageUrl
                  : `/${p.imageUrl || ""}`,
              }
            : it,
        ),
      }));
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      const res = await fetch(`/api/admin/products/${deleting.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Produto deletado");
      setData((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== deleting.id),
      }));
    } catch {
      toast.error("Falha ao deletar");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <AdminHeader onSearch={setQ} />

      <main className="container py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Produtos</h1>
          <button
            onClick={() => setCreating(true)}
            className="rounded-xl bg-brand-800 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-900 flex items-center"
          >
            <Plus size={20} color="#fff" className="mr-1" /> Criar produto
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-60 animate-pulse rounded-xl border bg-white"
              />
            ))}
          </div>
        ) : (
          <>
            {filtered.length >= 1 && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {filtered.map((p) => (
                  <ProductAdminCard
                    key={p.id}
                    product={p}
                    onEdit={setEditing}
                    onDelete={setDeleting}
                  />
                ))}
              </div>
            )}

            {filtered.length === 0 && (
              <div className="min-h-[100px] flex justify-center items-center w-full">
                <p>Não foi encontrado nenhum produto</p>
              </div>
            )}
          </>
        )}
      </main>

      <EditProductModal
        open={!!editing}
        product={editing}
        onClose={() => setEditing(null)}
        onSaved={onSaved}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Deletar produto"
        message="Esta ação não pode ser desfeita. Deseja continuar?"
        confirmLabel="Deletar"
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />

      <CreateProduct
        open={!!creating}
        onClose={() => setCreating(null)}
        onSaved={onSaved}
      />
    </>
  );
}
