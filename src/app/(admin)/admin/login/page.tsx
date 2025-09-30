"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFormState } from "react-dom";
import { authenticateAdmin } from "@/app/(admin)/lib/actions";

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; err?: string }>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{
    next?: string;
    err?: string;
  }>({});

  const [state, formAction] = useFormState(authenticateAdmin, {
    error: "",
  });

  useEffect(() => {
    const resolveParams = async () => {
      const params = await searchParams;
      setResolvedParams(params);

      if (params?.err === "not_admin") {
        toast.error("Você não tem permissão de administrador.");
      }
    };

    resolveParams();
  }, [searchParams]);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
      setBusy(false);
    }
  }, [state]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    setBusy(true);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    if (resolvedParams.next) {
      formData.append("next", resolvedParams.next);
    }

    formAction(formData);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 grid place-items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin</h1>
          <p className="text-slate-600">Acesso administrativo</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoFocus
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl px-4 py-4 text-sm font-semibold hover:from-brand-700 hover:to-brand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {busy ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Entrando...</span>
                </div>
              ) : (
                "Acessar Painel"
              )}
            </button>
          </div>

          <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-slate-600">
                Esta área é restrita a administradores autorizados.
              </p>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
