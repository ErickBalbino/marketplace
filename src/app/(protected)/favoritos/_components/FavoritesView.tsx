"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Rows3 } from "lucide-react";
import { toast } from "sonner";

import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/hooks/useAuth";
import { useIsMounted } from "@/hooks/useIsMounted";
import type { Product } from "@/types/product";
import { addToCart } from "@/services/cart/client";
import { AuthModal } from "@/components/AuthModal";
import { FavoriteItem } from "./FavoriteItem";

type View = "grid" | "list";

export default function FavoritesView() {
  const mounted = useIsMounted();

  const { favorites, removeFavorite } = useFavorites();
  const { isAuthenticated, isLoading } = useAuth();

  const [view, setView] = useState<View>("grid");
  const [busy, setBusy] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const items = useMemo(() => favorites, [favorites]);
  const hasItems = items.length > 0;

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border p-3">
            <div className="aspect-square rounded bg-slate-100 animate-pulse" />
            <div className="mt-3 h-4 w-3/5 rounded bg-slate-100 animate-pulse" />
            <div className="mt-2 h-4 w-24 rounded bg-slate-100 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  async function handleAddToCart(p: Product) {
    if (isLoading) return;
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    try {
      setBusy(p.id);
      await addToCart(p.id, 1);
      toast.success("Adicionado ao carrinho", { position: "top-right" });
    } catch {
      toast.error("Não foi possível adicionar ao carrinho", {
        position: "top-right",
      });
    } finally {
      setBusy(null);
    }
  }

  function handleRemove(p: Product) {
    removeFavorite(p.id);
    toast.info("Removido dos favoritos", { position: "top-right" });
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          {hasItems ? (
            <>
              Você favoritou <strong>{items.length}</strong>{" "}
              {items.length === 1 ? "item" : "itens"}
              {items.length > 1 ? "s" : ""}.
            </>
          ) : (
            <>Nenhum produto favorito ainda.</>
          )}
        </div>

        <div className="inline-flex rounded-xl border overflow-hidden ">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={`inline-flex items-center gap-2 px-3 py-2 text-sm cursor-pointer ${
              view === "grid" ? "bg-slate-100" : ""
            }`}
            aria-pressed={view === "grid"}
            aria-label="Ver em grade"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={`inline-flex items-center gap-2 px-3 py-2 text-sm cursor-pointer ${
              view === "list" ? "bg-slate-100" : ""
            }`}
            aria-pressed={view === "list"}
            aria-label="Ver em lista"
          >
            <Rows3 size={18} />
          </button>
        </div>
      </div>

      {!hasItems ? (
        <div className="mt-8 rounded-2xl p-8 text-center">
          <p className="text-slate-700">
            Você ainda não possui produtos favorito
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-900"
          >
            Explorar produtos
          </Link>
        </div>
      ) : view === "list" ? (
        <ul role="list" className="mt-4 divide-y rounded-2xl border">
          {items.map((p) => {
            const title = p.name ?? (p as Product).title ?? "Produto";
            return (
              <FavoriteItem
                key={p.id}
                p={p}
                busy={busy}
                title={title}
                handleAddToCart={handleAddToCart}
                handleRemove={handleRemove}
                view="list"
              />
            );
          })}
        </ul>
      ) : (
        <div className="mt-4 grid gap-4 max-sm:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => {
            const title = p.name ?? (p as Product).title ?? "Produto";
            return (
              <FavoriteItem
                key={p.id}
                p={p}
                busy={busy}
                title={title}
                handleAddToCart={handleAddToCart}
                handleRemove={handleRemove}
                view="grid"
              />
            );
          })}
        </div>
      )}

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        action="favorite"
      />
    </>
  );
}
