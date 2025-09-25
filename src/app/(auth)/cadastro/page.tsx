import type { Metadata } from "next";
import Link from "next/link";

import { RegisterForm } from "./_components/RegisterForm";

type Props = { searchParams: Promise<{ next?: string }> };

export const metadata: Metadata = { title: "Criar conta — Marketplace" };

export default async function RegisterPage({ searchParams }: Props) {
  const search = await searchParams;
  const next = search?.next ?? "";

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-center">
          Cadastre sua conta
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Em poucos passos você vai poder acompanhar pedidos, salvar favoritos e
          aproveitar ofertas.
        </p>
      </header>

      <RegisterForm next={next} />

      <p className="mt-6 text-center text-sm text-slate-600">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-800 hover:text-brand-900"
        >
          Entrar
        </Link>
      </p>
    </main>
  );
}
