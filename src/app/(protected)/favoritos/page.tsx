import type { Metadata } from "next";
import FavoritesView from "./_components/FavoritesView";

export const metadata: Metadata = {
  title: "Favoritos — AllMarket",
  description: "Seus produtos favoritos no AllMarket",
};

export default function FavoritesPage() {
  return (
    <main className="container py-6 max-sm:px-3">
      <section aria-labelledby="fav-title" className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h1
            id="fav-title"
            className="text-2xl font-semibold tracking-tight mt-3"
          >
            Meus favoritos
          </h1>
          <p className="text-sm text-slate-600">
            Produtos salvos para ver mais tarde
          </p>
        </div>

        <FavoritesView />
      </section>
    </main>
  );
}
