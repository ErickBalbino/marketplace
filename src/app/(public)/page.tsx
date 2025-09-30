import Link from "next/link";
import { ChevronLeft, ChevronRight, LayoutGrid, Rows3 } from "lucide-react";
import { fetchProducts } from "@/services/products";
import { Metadata } from "next";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { FilterControls } from "@/components/home/FilterControls";
import { ProductsGrid } from "@/components/home/ProductsGrid";

type View = "grid4" | "grid2" | "list";

export const metadata: Metadata = {
  title: "AllMarket",
  description:
    "Encontre os melhores produtos e ofertas na sua região aqui no AllMarket",
};

function hrefWith(
  base: string,
  current: Record<string, string | number | undefined>,
  patch: Record<string, string | number | undefined>,
) {
  const sp = new URLSearchParams();
  const merged: Record<string, string> = {};
  Object.entries(current).forEach(([k, v]) => {
    if (v !== undefined && v !== "") merged[k] = String(v);
  });
  Object.entries(patch).forEach(([k, v]) => {
    if (v === undefined || v === "") delete merged[k];
    else merged[k] = String(v);
  });
  Object.entries(merged).forEach(([k, v]) => sp.set(k, v));
  const qs = sp.toString();
  return qs ? `${base}?${qs}` : base;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const page = Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1;
  const limit = Number(Array.isArray(sp.limit) ? sp.limit[0] : sp.limit) || 12;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q) || "";
  const view =
    ((Array.isArray(sp.view) ? sp.view[0] : sp.view) as View) || "grid4";
  const g =
    ((Array.isArray(sp.g) ? sp.g[0] : sp.g) as View | undefined) || "grid4";

  const data = await fetchProducts({ page, limit, q });

  const base = "/";
  const currentParams = { page, limit, q, view, g };

  const columnsNextView =
    view === "list" ? g : view === "grid4" ? "grid2" : "grid4";
  const columnsHref = hrefWith(base, currentParams, {
    view: columnsNextView,
    g: columnsNextView,
  });

  const listHref =
    view === "list"
      ? hrefWith(base, currentParams, { view: g, g: "" })
      : hrefWith(base, currentParams, { view: "list", g: view });

  const totalPages = Math.max(1, Math.ceil(data.total / data.limit));
  const prevHref =
    page > 1 ? hrefWith(base, currentParams, { page: page - 1 }) : undefined;
  const nextHref =
    page < totalPages
      ? hrefWith(base, currentParams, { page: page + 1 })
      : undefined;

  return (
    <main className="container max-sm:px-3 lg:py-6 -translate-y-[120px]">
      <section className="space-y-4">
        <CategoryCarousel />

        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Produtos mais vendidos</h2>

          <div className="flex items-center self-end gap-2">
            <FilterControls />

            <Link
              href={columnsHref}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-slate-50 ${
                (view === "grid4" || view === "grid2") && "bg-slate-200"
              }`}
              aria-label="Alternar colunas"
              prefetch={false}
            >
              <LayoutGrid size={18} />
              {view !== "list" && (
                <span className="hidden sm:inline">
                  {view === "grid4" ? "4" : view === "grid2" && "2"}
                </span>
              )}
            </Link>

            <Link
              href={listHref}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm bg-white hover:bg-slate-100 ${
                view === "list" && "bg-slate-200"
              }`}
              aria-label="Alternar lista"
              prefetch={false}
            >
              <Rows3 size={18} />
            </Link>
          </div>
        </div>

        {data.products.length === 0 && (
          <div className="min-h-[100px] flex justify-center items-center w-full">
            <p>Não foi encontrado nenhum produto</p>
          </div>
        )}

        <ProductsGrid products={data.products} view={view} />

        <div className="mt-6 flex items-center justify-between gap-3">
          <div className="text-sm text-slate-600">
            Página <strong>{data.page}</strong> de <strong>{totalPages}</strong>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={prevHref || "#"}
              aria-disabled={!prevHref}
              className="rounded-xl border px-3 py-2 text-sm  bg-slate-300 hover:bg-slate-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer"
              prefetch={false}
            >
              <ChevronLeft size={18} />
            </Link>
            <Link
              href={nextHref || "#"}
              aria-disabled={!nextHref}
              className="rounded-xl border px-3 py-2 text-sm bg-slate-300 aria-disabled:pointer-events-none aria-disabled:opacity-50 cursor-pointer"
              prefetch={false}
            >
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
