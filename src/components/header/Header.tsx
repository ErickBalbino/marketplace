import { Search, MapPin, Heart, ShoppingCart, Menu, User } from "lucide-react";
import Link from "next/link";

import { getSession } from "@/lib/auth";

import { UserMenu } from "./UserMenu";

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

export default async function Header() {
  const session = await getSession();
  const user = session?.user as
    | { name?: string; email?: string; avatarUrl?: string }
    | undefined;

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
          action={async (formData) => {
            "use server";
            String(formData.get("query") || "").trim();
            // Opcional: use redirect aqui para manter server-side
          }}
          role="search"
          aria-label="Buscar produtos"
          className="relative hidden w-full max-w-2xl items-center md:flex"
        >
          <input
            name="query"
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
          data-cep
          className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-slate-50 md:inline-flex"
          aria-label="Informe seu CEP para calcular frete e prazo"
        >
          <MapPin size={18} />
          <span className="whitespace-nowrap">Informe seu CEP</span>
        </button>

        <nav aria-label="Ações" className="ml-auto flex items-center gap-2">
          {user ? (
            <UserMenu
              name={user.name || user.email || "Usuário"}
              email={user.email || ""}
              avatarUrl={user.avatarUrl}
            />
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-md border px-4 py-3 text-sm bg-brand-800 text-white hover:bg-brand-900"
            >
              <User size={18} /> Acesse sua conta
            </Link>
          )}

          <Link
            href="/favoritos"
            className="inline-flex items-center rounded-md px-3 py-2 text-sm"
            aria-label="Favoritos"
            title="Favoritos"
          >
            <Heart size={22} />
          </Link>

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
        <form role="search" className="relative flex items-center">
          <input
            name="q"
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
          data-cep
          className="mt-2 inline-flex items-center gap-2 rounded-md py-2 text-sm hover:bg-slate-50"
          aria-label="Informe seu CEP para calcular frete e prazo"
        >
          <MapPin size={16} />
          <span>Informe seu CEP</span>
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
              <Link
                key={cat}
                href={`/categoria/${encodeURIComponent(cat.toLowerCase())}`}
                className="shrink-0 rounded-md px-2 py-1 text-slate-700 hover:bg-slate-100"
              >
                {cat}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
