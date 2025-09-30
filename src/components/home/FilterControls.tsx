"use client";

import { SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function FilterControls() {
  const sp = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const startMin = Number(sp.get("minPrice") ?? 0);
  const startMax = Number(sp.get("maxPrice") ?? 0);
  const startFav = sp.get("fav") === "1";

  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(startMin || 0);
  const [max, setMax] = useState(startMax || 50000);
  const [favOnly, setFavOnly] = useState(startFav);

  useEffect(() => {
    if (min > max) setMax(min);
  }, [max, min]);
  useEffect(() => {
    if (max < min) setMin(max);
  }, [max, min]);

  const priceLabel = useMemo(() => {
    const f = (n: number) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(n);
    return `${f(min)} — ${f(max)}`;
  }, [min, max]);

  function apply() {
    const next = new URLSearchParams(sp.toString());
    next.set("minPrice", String(min));
    next.set("maxPrice", String(max));
    if (favOnly) next.set("fav", "1");
    else next.delete("fav");

    next.delete("page");

    router.push(`${pathname}?${next.toString()}`);
    setOpen(false);
  }

  function clear() {
    const next = new URLSearchParams(sp.toString());
    next.delete("minPrice");
    next.delete("maxPrice");
    next.delete("fav");
    next.delete("page");
    setMin(0);
    setMax(50000);
    setFavOnly(false);
    router.push(`${pathname}?${next.toString()}`);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm bg-white hover:bg-slate-100 cursor-pointer"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="filters-panel"
      >
        <SlidersHorizontal size={18} />
        Filtros
      </button>

      {open && (
        <div
          id="filters-panel"
          role="dialog"
          aria-label="Filtros de produtos"
          className="absolute right-0 z-20 mt-2 w-[320px] rounded-xl border bg-white p-4 shadow-xl"
        >
          <div>
            <p className="text-sm font-medium">Preço</p>

            <div className="mt-3 px-1">
              <div className="relative h-8">
                <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200" />
                <div
                  className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand-700"
                  style={{
                    left: `${(Math.min(min, max) / 50000) * 100}%`,
                    right: `${(1 - Math.max(min, max) / 50000) * 100}%`,
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={100}
                  value={min}
                  onChange={(e) => setMin(Number(e.target.value))}
                  className="pointer-events-auto absolute left-0 right-0 top-0 h-8 w-full appearance-none bg-transparent"
                  aria-label="Preço mínimo"
                />
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={100}
                  value={max}
                  onChange={(e) => setMax(Number(e.target.value))}
                  className="pointer-events-auto absolute left-0 right-0 top-0 h-8 w-full appearance-none bg-transparent"
                  aria-label="Preço máximo"
                />
              </div>

              <div className="mt-2 text-xs text-slate-600">{priceLabel}</div>
            </div>
          </div>

          <label className="mt-4 inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="accent-brand-800"
              checked={favOnly}
              onChange={(e) => setFavOnly(e.target.checked)}
            />
            Mostrar apenas favoritos
          </label>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={clear}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-slate-50"
            >
              Limpar
            </button>
            <button
              type="button"
              onClick={apply}
              className="rounded-lg bg-brand-800 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-900"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
