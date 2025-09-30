"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useFavorites } from "@/contexts/FavoritesContext";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

type View = "grid4" | "grid2" | "list";

function gridClasses(view: View) {
  if (view === "grid2")
    return "grid max-sm:grid-cols-2 grid-cols-2 gap-10 max-sm:gap-0";
  if (view === "grid4")
    return "grid max-sm:grid-cols-2 grid-cols-2 lg:grid-cols-4 gap-6 max-sm:gap-0";
  return "grid grid-cols-1 gap-3";
}

export function ProductsGrid({
  products,
  view,
}: {
  products: Product[];
  view: View;
}) {
  const sp = useSearchParams();
  const router = useRouter();
  const { favorites } = useFavorites();

  const minPrice = Number(sp.get("minPrice") ?? 0);
  const maxPrice = Number(sp.get("maxPrice") ?? 0);
  const favOnly = sp.get("fav") === "1";

  const favSet = new Set(favorites.map((f) => f.id));

  const filtered = products.filter((p) => {
    const priceOk =
      (minPrice ? p.price >= minPrice : true) &&
      (maxPrice ? p.price <= maxPrice : true);
    const favOk = favOnly ? favSet.has(p.id) : true;
    return priceOk && favOk;
  });

  const clearFilters = () => {
    router.push("/", { scroll: false });
  };

  if (filtered.length === 0 && (minPrice > 0 || maxPrice > 0 || favOnly)) {
    return (
      <div className="min-h-[100px] flex flex-col justify-center items-center w-full gap-4">
        <p className="text-slate-600">
          Nenhum produto com os filtros selecionados
        </p>

        {(minPrice > 0 || maxPrice > 0 || favOnly) && (
          <button
            onClick={clearFilters}
            className="rounded-lg bg-brand-800 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-900 transition-colors cursor-pointer"
          >
            Limpar filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={gridClasses(view)}>
      {filtered.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          variant={view === "list" ? "list" : "grid"}
        />
      ))}
    </div>
  );
}
