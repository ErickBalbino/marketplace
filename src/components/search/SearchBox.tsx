"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { normalizeText, makeSlug } from "@/utils/text";
import { brl } from "@/utils/formatCurrency";

type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
};

type IndexResponse = { products: Product[] };

function useProductIndex() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        // cache leve em sessionStorage
        const cache = sessionStorage.getItem("search_index_v1");
        if (cache) {
          const parsed: IndexResponse = JSON.parse(cache);
          if (active) setProducts(parsed.products ?? []);
          setLoading(false);
          // paralelamente tenta atualizar o cache
          fetch("/api/search/index")
            .then((r) => r.json())
            .then((json: IndexResponse) => {
              sessionStorage.setItem("search_index_v1", JSON.stringify(json));
              if (active) setProducts(json.products ?? []);
            })
            .catch(() => {});
          return;
        }

        const res = await fetch("/api/search/index", { cache: "no-store" });
        const json: IndexResponse = await res.json();
        if (active) {
          setProducts(json.products ?? []);
          sessionStorage.setItem("search_index_v1", JSON.stringify(json));
        }
      } catch {
        if (active) setError("Falha ao carregar índice de busca");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { loading, products, error };
}

export function SearchBox({
  className = "",
  inputClassName = "",
  placeholder = "Busque por produtos, marcas ou categorias...",
}: {
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const { loading, products } = useProductIndex();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [debounced, setDebounced] = useState("");

  // debounce simples
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 150);
    return () => clearTimeout(id);
  }, [query]);

  const filtered = useMemo(() => {
    if (!debounced) return [];
    const q = normalizeText(debounced);
    // match em nome e descrição
    return products
      .filter((p) => {
        const hay = `${normalizeText(p.name)} ${normalizeText(p.description)}`;
        return hay.includes(q);
      })
      .slice(0, 8); // limita sugestões
  }, [debounced, products]);

  useEffect(() => {
    if (debounced.length > 0 && filtered.length > 0) {
      setOpen(true);
      setActiveIndex(0);
    } else {
      setOpen(false);
      setActiveIndex(-1);
    }
  }, [debounced, filtered]);

  function goToProduct(p: Product) {
    const slug = makeSlug(p.name || "produto");
    router.push(`/produto/${slug}?id=${encodeURIComponent(p.id)}`);
    setOpen(false);
    setActiveIndex(-1);
  }

  function submitFullSearch() {
    const q = query.trim();
    if (!q) return;
    router.push(`/?q=${encodeURIComponent(q)}`);
    setOpen(false);
    setActiveIndex(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === "Enter") {
        submitFullSearch();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filtered[activeIndex]) {
        goToProduct(filtered[activeIndex]);
      } else {
        submitFullSearch();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative">
        {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
        <input
          ref={inputRef}
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => filtered.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-slate-500 focus:border-brand-700 focus:ring-1 focus:ring-brand/30 ${inputClassName}`}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="search-suggestions"
          aria-label="Campo de busca"
        />

        <button
          type="button"
          aria-label="Buscar"
          onClick={submitFullSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 hover:bg-slate-100"
        >
          <Search size={18} className="text-slate-600" />
        </button>
      </div>

      {open && (
        <ul
          id="search-suggestions"
          role="listbox"
          ref={listRef}
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border bg-white shadow-xl"
        >
          {loading && (
            <li className="p-3 text-sm text-slate-600">Carregando…</li>
          )}

          {!loading && filtered.length === 0 && debounced && (
            <li className="p-3 text-sm text-slate-600">
              Nenhum resultado para “{debounced}”
            </li>
          )}

          {!loading &&
            filtered.map((p, i) => (
              <li
                key={p.id}
                role="option"
                aria-selected={i === activeIndex}
                className={`flex cursor-pointer items-center gap-3 p-3 text-sm hover:bg-slate-50 ${
                  i === activeIndex ? "bg-slate-50" : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  goToProduct(p);
                }}
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-md bg-slate-50">
                  <Image
                    src={p.imageUrl || "/next.svg"}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{p.name}</div>
                  <div className="text-xs text-slate-500">{brl(p.price)}</div>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
