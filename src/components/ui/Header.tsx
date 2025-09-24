"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, MapPin, User, Heart, ShoppingCart, Menu } from "lucide-react";

const CATEGORIES = [
  "Departamentos",
  "Telefonia",
  "Eletrodomésticos",
  "TVs e Vídeo",
  "Móveis",
  "Eletroportáteis",
  "Informática",
  "Games",
  "Esporte",
];

export function Header() {
  const [q, setQ] = useState("");
  const [cep, setCep] = useState<string | null>(null);
  const router = useRouter();

  function submitSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/?q=${encodeURIComponent(query)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur max-sm:px-3">
      <div className="container flex items-center gap-3 py-3">
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-tight leading-none"
          aria-label="Ir para a home"
        >
          <span className="text-brand-800">Market</span>place
        </Link>

        <form
          onSubmit={submitSearch}
          role="search"
          aria-label="Buscar produtos"
          className="relative hidden w-full max-w-2xl items-center md:flex"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            placeholder="O que você está procurando?"
            className="w-full rounded-xl border bg-white px-4 py-2.5 pr-10 text-sm ring-1 ring-transparent placeholder:text-slate-600 focus:border-brand focus:ring-brand/40"
            aria-label="Campo de busca"
          />
          <Search
            size={18}
            className="pointer-events-none absolute right-3 text-slate-700"
            aria-hidden
          />
        </form>

        <button
          type="button"
          onClick={() => {
            // TODO: abrir modal para digitar CEP; por ora, simula
            const c = prompt("Informe seu CEP:");
            if (c) setCep(c);
          }}
          className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-slate-50 md:inline-flex"
          aria-label="Informe seu CEP para calcular frete e prazo"
        >
          <MapPin size={18} />
          <span className="whitespace-nowrap">
            {cep ? `CEP: ${cep}` : "Informe seu CEP"}
          </span>
        </button>

        <nav aria-label="Ações" className="ml-auto flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-md border px-4 py-3 text-sm bg-brand-800 text-white hover:bg-brand-900"
          >
            <User size={16} />
            <span className="hidden sm:inline">Acesse sua conta</span>
          </Link>
          <button
            type="button"
            className="inline-flex items-center rounded-md px-3 py-2 text-sm"
            aria-label="Favoritos"
            title="Favoritos"
          >
            <Heart size={22} />
          </button>
          <Link
            href="/carrinho"
            className="inline-flex items-center rounded-m"
            aria-label="Abrir carrinho"
          >
            <ShoppingCart size={22} />
          </Link>
        </nav>
      </div>

      <div className="container gap-2 pb-2 md:hidden">
        <form
          onSubmit={submitSearch}
          role="search"
          className="relative flex items-center"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            placeholder="Buscar produtos…"
            className="w-full rounded-full border bg-white px-4 py-2.5 pr-10 text-sm outline-none ring-1 ring-transparent placeholder:text-slate-400 focus:border-brand focus:ring-brand/40"
            aria-label="Buscar"
          />
          <Search
            size={18}
            className="pointer-events-none absolute right-3 text-slate-400"
            aria-hidden
          />
        </form>
        <button
          type="button"
          onClick={() => {
            const c = prompt("Informe seu CEP:");
            if (c) setCep(c);
          }}
          className="mt-2 inline-flex items-center gap-2 rounded-md py-2 text-sm hover:bg-slate-50"
          aria-label="Informe seu CEP para calcular frete e prazo"
        >
          <MapPin size={16} />
          <span>{cep ? `CEP: ${cep}` : "Informe seu CEP"}</span>
        </button>
      </div>

      <div>
        <div className="container flex items-center gap-3 py-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
            aria-label="Abrir lista de departamentos"
          >
            <Menu size={18} />
            <span className="hidden sm:inline">Departamentos</span>
          </button>

          <nav
            aria-label="Departamentos"
            className="flex w-full items-center gap-4 overflow-x-auto whitespace-nowrap text-sm"
          >
            {CATEGORIES.slice(1).map((cat) => (
              <button
                key={cat}
                type="button"
                className="shrink-0 rounded-md px-2 py-1 text-slate-700 hover:bg-slate-100"
                // TODO: navegar para rota/categoria
              >
                {cat}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
