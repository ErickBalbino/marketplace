"use client";

import { useEffect } from "react";
import { RefreshCw, Home, TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function RegisterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Register error boundary]", error);
  }, [error]);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-brand-50 to-white">
      <main className="container flex min-h-dvh items-center justify-center py-12">
        <div className="w-full max-w-lg rounded-2xl border bg-white p-8 shadow-card text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning-50">
            <TriangleAlert className="text-warning-600" size={24} aria-hidden />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Algo deu errado ao criar sua conta
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {error?.message || "Ocorreu um erro inesperado. Tente novamente."}
          </p>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              <RefreshCw size={16} />
              Tentar novamente
            </button>

            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-slate-50"
            >
              <Home size={16} />
              Voltar para a Home
            </Link>
          </div>

          {error?.digest && (
            <p className="mt-4 text-xs text-slate-500">
              Código do erro: <span className="font-mono">{error.digest}</span>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
