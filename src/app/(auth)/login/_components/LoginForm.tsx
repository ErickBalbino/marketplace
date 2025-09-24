"use client";

import { useActionState, useState, startTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { schema, type LoginFormValues } from "../schema";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

type State = { error?: string };
type Props = {
  action: (prevState: State, formData: FormData) => Promise<State>;
};

export function LoginForm({ action }: Props) {
  const [state, formAction, pending] = useActionState<State, FormData>(
    action,
    {},
  );
  const [show, setShow] = useState(false);

  const {
    register,
    trigger,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  async function handleValidateAndSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    const ok = await trigger(undefined, { shouldFocus: true });
    if (!ok) return;

    const fd = new FormData(form);
    startTransition(() => {
      formAction(fd);
    });
  }

  return (
    <div className="border-gray-300 bg-white/80">
      {state?.error && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700"
        >
          {state.error}
        </div>
      )}

      <form className="space-y-3" noValidate onSubmit={handleValidateAndSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            E-mail
          </label>
          <div className="relative mt-1">
            <Mail
              size={20}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              autoCapitalize="none"
              placeholder="voce@email.com"
              disabled={pending}
              className={`w-full rounded-xl border bg-white pl-10 pr-3 py-3 outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-brand/40 focus:border-brand-700 ${
                errors.email
                  ? "border-error-300 focus:border-error-400 focus:ring-error-200"
                  : ""
              }`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p
              id="email-error"
              className="mt-1 text-xs text-error-600"
              aria-live="polite"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Senha
          </label>
          <div className="relative mt-1">
            <Lock
              size={20}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              spellCheck={false}
              placeholder="------------"
              disabled={pending}
              className={`w-full rounded-xl border bg-white pl-10 pr-10 py-3 outline-none placeholder:text-slate-400 focus:border-brand focus:ring-1 focus:ring-brand/40 focus:border-brand-700 ${
                errors.password
                  ? "border-error-300 focus:border-error-400 focus:ring-error-200"
                  : ""
              }`}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100"
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
            >
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-1 text-xs text-error-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="remember"
              className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
            />
            Lembrar de mim
          </label>
          <Link
            href="/recuperar-senha"
            className="text-sm text-brand text-brand-700 hover:text-brand-800"
          >
            Esqueci minha senha
          </Link>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text font-medium text-white transition bg-brand-800 hover:bg-brand-900 disabled:opacity-60"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>

        <div className="flex items-center text-xs gap-3 text-slate-500">
          <div className="h-px flex-1 bg-slate-300" />
          <span>ou</span>
          <div className="h-px flex-1 bg-slate-300" />
        </div>

        <button
          type="button"
          aria-label="Entrar com Google"
          className="inline-flex w-full items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium hover:bg-slate-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
            aria-hidden
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.9 6.2 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.4 0 19-8.4 19-19 0-1.3-.1-2.2-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.6 16.3 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.9 6.2 29.2 4 24 4 16 4 9.2 8.7 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.3 0 10.1-2 13.6-5.2l-6.3-5.2C29.2 35.3 26.8 36 24 36c-5.4 0-9.9-3.5-11.5-8.4l-6.6 5.1C8.8 39.1 15.8 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.2-4.9 8-11.3 8-6.6 0-12-5.4-12-12 0-6.6 5.4-12 12-12 3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.9 6.2 29.2 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.4 0 19-8.4 19-19 0-1.3-.1-2.2-.4-3.5z"
            />
          </svg>
          Entrar com Google
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Ainda não tem conta?{" "}
        <Link
          href="/cadastro"
          className="font-medium text-brand text-brand-700 hover:text-brand-800"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}
