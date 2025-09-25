"use client";

import {
  Mail,
  User,
  Phone,
  IdCard,
  Lock,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";
import { useActionState, startTransition, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IMaskInput } from "react-imask";
import Link from "next/link";

import { registerSchema, type RegisterFormValues } from "../schema";

import { registerAction } from "../actions";

type State = { error?: string };
type RegisterFormProps = {
  next?: string;
};

export function RegisterForm({ next = "" }: RegisterFormProps) {
  const [state, formAction, pending] = useActionState<State, FormData>(
    registerAction,
    {},
  );
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors, dirtyFields, isSubmitted },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      password: "",
      confirm: "",
    },
  });

  const showError = (name: keyof RegisterFormValues) => {
    if (isSubmitted) return Boolean(errors[name]);
    const value = getValues(name);
    const typedValue = (value ?? "").toString().length > 0;
    return Boolean(errors[name] && dirtyFields[name] && typedValue);
  };

  async function onSubmit(values: RegisterFormValues) {
    const resp = await trigger(undefined, { shouldFocus: true });
    if (!resp) return;

    const form = new FormData();
    form.set("name", values.name);
    form.set("email", values.email);
    form.set("password", values.password);
    form.set("phone", values.phone);
    form.set("cpf", values.cpf);

    form.set("next", next);

    startTransition(() => formAction(form));
  }

  return (
    <div className="mx-auto w-full">
      {state?.error && (
        <div
          role="alert"
          aria-live="polite"
          className="mb-6 rounded-md bg-error-100 px-3 py-4 text-sm text-error-700 flex gap-3 items-center"
        >
          <Info size={16} className="min-w-2" /> {state.error}
        </div>
      )}

      <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Nome
            </label>
            <div className="relative mt-1">
              <User
                size={20}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <input
                id="name"
                type="text"
                autoComplete="name"
                disabled={pending}
                placeholder="Seu nome"
                className={`w-full rounded-xl border border-slate-400 bg-white pl-10 pr-3 py-3 outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-brand/40 focus:border-brand-700 ${
                  showError("name")
                    ? "border-error-300 focus:border-error-400 focus:ring-error-200"
                    : ""
                }`}
                {...register("name")}
                aria-invalid={showError("name")}
                aria-describedby={showError("name") ? "name-error" : undefined}
              />
            </div>
            {showError("name") && (
              <p id="name-error" className="mt-1 text-xs text-error-600">
                {errors.name?.message}
              </p>
            )}
          </div>

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
                disabled={pending}
                placeholder="voce@email.com"
                className={`w-full rounded-xl border border-slate-400 bg-white pl-10 pr-3 py-3 outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-brand/40 focus:border-brand-700 ${
                  showError("email")
                    ? "border-error-300 focus:border-error-400 focus:ring-error-200"
                    : ""
                }`}
                {...register("email")}
                aria-invalid={showError("email")}
                aria-describedby={
                  showError("email") ? "email-error" : undefined
                }
              />
            </div>
            {showError("email") && (
              <p id="email-error" className="mt-1 text-xs text-error-600">
                {errors.email?.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium">
              Telefone
            </label>
            <div className="relative mt-1">
              <Phone
                size={20}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <Controller
                name="phone"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <IMaskInput
                    id="phone"
                    mask="(00) 00000-0000"
                    inputMode="tel"
                    unmask
                    lazy={false}
                    placeholder="(11) 91234-5678"
                    value={field.value ?? ""}
                    onAccept={(value: string) => field.onChange(value ?? "")}
                    onBlur={field.onBlur}
                    readOnly={pending}
                    className={`w-full rounded-xl border border-slate-400 bg-white pl-10 pr-3 py-3 outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-brand/40 focus:border-brand-700 ${
                      showError("phone")
                        ? "border-error-300 focus:border-error-400 focus:ring-error-200"
                        : ""
                    }`}
                    aria-invalid={showError("phone")}
                    aria-describedby={
                      showError("phone") ? "phone-error" : undefined
                    }
                  />
                )}
              />
            </div>
            {showError("phone") && (
              <p id="phone-error" className="mt-1 text-xs text-error-600">
                {errors.phone?.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="cpf" className="block text-sm font-medium">
              CPF
            </label>
            <div className="relative mt-1">
              <IdCard
                size={20}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <Controller
                name="cpf"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <IMaskInput
                    id="cpf"
                    mask="000.000.000-00"
                    inputMode="numeric"
                    unmask
                    lazy={false}
                    placeholder="000.000.000-00"
                    value={field.value ?? ""}
                    onAccept={(value: string) => field.onChange(value ?? "")}
                    onBlur={field.onBlur}
                    readOnly={pending}
                    className={`w-full rounded-xl border border-slate-400 bg-white pl-10 pr-3 py-3 outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-brand/40 focus:border-brand-700 ${
                      showError("cpf")
                        ? "border-error-300 focus:border-error-400 focus:ring-error-200"
                        : ""
                    }`}
                    aria-invalid={showError("cpf")}
                    aria-describedby={
                      showError("cpf") ? "cpf-error" : undefined
                    }
                  />
                )}
              />
            </div>
            {showError("cpf") && (
              <p id="cpf-error" className="mt-1 text-xs text-error-600">
                {errors.cpf?.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                type={show1 ? "text" : "password"}
                autoComplete="new-password"
                disabled={pending}
                placeholder="••••••"
                className={`w-full rounded-xl border border-slate-400 bg-white pl-10 pr-10 py-3 outline-none placeholder:text-slate-400 focus:border-brand focus:ring-1 focus:ring-brand/40 focus:border-brand-700 ${
                  showError("password")
                    ? "border-error-300 focus:border-error-400 focus:ring-error-200"
                    : ""
                }`}
                {...register("password")}
                aria-invalid={showError("password")}
                aria-describedby={
                  showError("password") ? "password-error" : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShow1((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100"
                aria-label={show1 ? "Ocultar senha" : "Mostrar senha"}
              >
                {show1 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {showError("password") && (
              <p id="password-error" className="mt-1 text-xs text-error-600">
                {errors.password?.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium">
              Confirmar senha
            </label>
            <div className="relative mt-1">
              <Lock
                size={20}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden
              />
              <input
                id="confirm"
                type={show2 ? "text" : "password"}
                autoComplete="new-password"
                disabled={pending}
                placeholder="••••••"
                className={`w-full rounded-xl border border-slate-400 bg-white pl-10 pr-10 py-3 outline-none placeholder:text-slate-400 focus:border-brand focus:ring-1 focus:ring-brand/40 focus:border-brand-700 ${
                  showError("confirm")
                    ? "border-error-300 focus:border-error-400 focus:ring-error-200"
                    : ""
                }`}
                {...register("confirm")}
                aria-invalid={showError("confirm")}
                aria-describedby={
                  showError("confirm") ? "confirm-error" : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShow2((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100"
                aria-label={show2 ? "Ocultar senha" : "Mostrar senha"}
              >
                {show2 ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {showError("confirm") && (
              <p id="confirm-error" className="mt-1 text-xs text-error-600">
                {errors.confirm?.message}
              </p>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Ao criar conta, você concorda com os{" "}
          <Link
            href="#"
            className="underline decoration-slate-300 hover:text-slate-700 text-brand-800"
          >
            Termos de Uso
          </Link>{" "}
          e{" "}
          <Link
            href="#"
            className="underline decoration-slate-300 hover:text-slate-700 text-brand-800"
          >
            Política de Privacidade
          </Link>
          .
        </p>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text font-medium text-white transition bg-brand-800 hover:bg-brand-900 disabled:opacity-60 cursor-pointer"
        >
          {pending ? "Criando conta…" : "Criar conta"}
        </button>
      </form>
    </div>
  );
}
