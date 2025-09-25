import type { Metadata } from "next";
import Image from "next/image";
import { authenticate } from "./actions";
import { ShoppingBag, ShieldCheck, Truck, Star } from "lucide-react";
import { LoginForm } from "./_components/LoginForm";

export const metadata: Metadata = { title: "Entrar — Marketplace" };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const next = params?.next ?? "";

  return (
    <div className="mx-auto grid min-h-[80dvh] w-full max-w-6xl grid-cols-1 overflow-hidden rounded-3xl border border-gray-300 bg-white shadow-card lg:min-h-[80dvh] lg:grid-cols-2">
      <section aria-hidden className="relative hidden lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_0%_0%,rgba(37,99,235,0.28),transparent_60%)]" />

        <Image
          src="/login-illustration.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 0vw"
          className="object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_60%_at_0%_50%,rgba(0,0,0,0.28),transparent_60%),radial-gradient(100%_60%_at_100%_50%,rgba(0,0,0,0.28),transparent_60%)]" />

        <div className="absolute inset-x-0 bottom-0 p-8 text-white">
          <h2 className="text-2xl font-semibold tracking-tight">Marketplace</h2>
          <p className="mt-1 max-w-md text-sm text-white/85">
            Entre para acompanhar pedidos, salvar favoritos e aproveitar ofertas
            de marcas parceiras.
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <li className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-accent-600" />
              Pagamento seguro
            </li>
            <li className="flex items-center gap-2">
              <Truck size={18} className="text-accent-600" />
              Entrega rápida
            </li>
            <li className="flex items-center gap-2">
              <ShoppingBag size={17} className="text-accent-600" />
              Marcas oficiais
            </li>
            <li className="flex items-center gap-2">
              <Star size={18} className="text-accent-600" />
              Avaliações reais
            </li>
          </ul>
        </div>

        <div className="absolute right-0 top-0 h-full w-px bg-black/10" />
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <header className="mb-4">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acesse sua conta
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Informe seu e-mail e senha para continuar.
            </p>
          </header>

          <LoginForm action={authenticate} next={next} />
        </div>
      </section>
    </div>
  );
}
