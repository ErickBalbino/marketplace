import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, Heart, ShoppingCart, User2 } from "lucide-react";

import { getSession } from "@/lib/auth";
import { UserMenu } from "@/components/header/_components/UserMenu";
import { CepModal } from "@/components/header/_components/cep/CepModal";
import { MobileSidebarTrigger } from "@/components/layout/MobileSidebar/MobileSidebarTrigger";
import { maskCep } from "./_components/cep/_utils/functions";

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

  const jar = await cookies();
  const shipToRaw = jar.get("ship_to")?.value ?? "";
  let shipTo: null | { cep: string; label?: string } = null;

  try {
    shipTo = shipToRaw ? JSON.parse(shipToRaw) : null;
  } catch {}

  return (
    <header className="sticky top-0 z-50   bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex items-center py-3 lg:py-4">
        <MobileSidebarTrigger user={user} categories={CATEGORIES} />

        <Link
          href="/"
          className="lg:shrink-0 text-xl font-bold tracking-tight leading-none mx-auto lg:mx-0"
          aria-label="Ir para a home"
        >
          <Image
            alt="Logo"
            src="/logo.png"
            priority
            width={170}
            height={60}
            className="w-[150px] h-[52px] lg:w-[170px] lg:h-[60px]"
          />
        </Link>

        <div className="hidden lg:flex mx-auto w-full max-w-2xl items-center">
          <form
            action="/"
            role="search"
            aria-label="Buscar produtos"
            className="relative w-full"
          >
            <input
              name="q"
              placeholder="O que você está procurando?"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-slate-500 focus:border-brand-700 focus:ring-1 focus:ring-brand/30"
              aria-label="Campo de busca"
            />
            <Search
              size={18}
              className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-600"
              aria-hidden
            />
          </form>
        </div>

        <div className="flex items-center gap-2 lg:gap-3 ml-auto lg:ml-0">
          <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Search size={22} />
          </button>

          <div className="hidden lg:block">
            <CepModal
              label={
                shipTo ? (
                  <span className="flex min-w-0 flex-col text-left">
                    <span className="text-[12px] leading-none text-slate-600 mb-[2px]">
                      Entrega para
                    </span>
                    <span className="truncate text-sm font-medium text-slate-900">
                      CEP: {shipTo.cep}
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-800">Informe seu CEP</span>
                )
              }
            />
          </div>

          <div className="flex items-center space-x-1 mr-3 lg:mr-0">
            <Link
              href="/favoritos"
              className="hidden lg:inline-flex items-center rounded-md p-2 hover:bg-slate-100 transition-all"
              aria-label="Favoritos"
            >
              <Heart size={22} />
            </Link>

            <Link
              href="/carrinho"
              className="inline-flex items-center rounded-md p-2 hover:bg-slate-100 relative"
              aria-label="Carrinho de compras"
            >
              <ShoppingCart size={22} />
              <span className="absolute -top-0 -right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Link>

            {user ? (
              <div className="hidden lg:block ml-2">
                <UserMenu
                  name={user.name || user.email || "Usuário"}
                  email={user.email || ""}
                  avatarUrl={user.avatarUrl}
                />
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden lg:inline-flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-900 transition-colors"
              >
                <User2 size={18} />
                <span className="hidden xl:inline">Acesse sua conta</span>
                <span className="xl:hidden">Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="container flex items-center py-2">
          <div className="lg:hidden flex-1 bg-brand-700">
            <CepModal
              label={
                <span className="flex items-center gap-2 text-sm text-slate-50 lg:text-slate-700">
                  {shipTo ? (
                    <span className="truncate">
                      Entregar em: {maskCep(shipTo.cep)}
                    </span>
                  ) : (
                    <span className="text-slate-50">
                      Informar CEP para fretes e prazos
                    </span>
                  )}
                </span>
              }
            />
          </div>

          <div className="hidden lg:flex items-center gap-3 w-full">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm hover:bg-slate-50 transition-colors"
              aria-label="Abrir lista de departamentos"
            >
              <Menu size={20} />
              <span>Departamentos</span>
            </button>

            <nav
              aria-label="Departamentos"
              className="flex items-center gap-4 overflow-x-auto whitespace-nowrap text-sm"
            >
              {CATEGORIES.slice(1).map((cat) => (
                <Link
                  key={cat}
                  href={`/categoria/${encodeURIComponent(cat.toLowerCase())}`}
                  className="shrink-0 rounded-md px-2 py-1 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
