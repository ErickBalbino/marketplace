"use client";

import { CreditCard, MapPin, ShoppingCart } from "lucide-react";
import Link from "next/link";

type Step = "cart" | "address" | "checkout";

const steps: { key: Step; label: string; href: string }[] = [
  { key: "cart", label: "Carrinho", href: "/carrinho" },
  { key: "address", label: "Endereço", href: "/carrinho/endereco" },
  { key: "checkout", label: "Checkout", href: "/carrinho/checkout" },
];

export function CheckoutStepper({ current }: { current: Step }) {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <nav
      aria-label="Etapas do checkout"
      className="mb-6 overflow-x-auto overflow-y-hidden pl-20 py-3 lg:pl-0 lg:py-3 lg:overflow-hidden"
    >
      <ol className="mx-auto max-w-5xl flex items-center justify-center gap-0 lg:gap-6">
        {steps.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li key={s.key} className="flex items-center gap-0 lg:gap-2">
              <Link
                href={s.href}
                className={[
                  "flex items-center gap-2 rounded-full px-3 py-2 text-sm transition",
                  done
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : active
                      ? "bg-brand-50 text-brand-900 ring-1 ring-brand-200"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
                ].join(" ")}
                aria-current={active ? "step" : undefined}
              >
                <span
                  className={[
                    "grid h-8 w-8 place-items-center rounded-full text-xs font-bold",
                    done
                      ? "bg-emerald-600 text-white"
                      : active
                        ? "bg-brand-800 text-white"
                        : "bg-slate-200 text-slate-700",
                  ].join(" ")}
                  aria-hidden
                >
                  {i + 1 == 1 && <ShoppingCart size={18} />}
                  {i + 1 == 2 && <MapPin size={18} />}
                  {i + 1 == 3 && <CreditCard size={18} />}
                </span>
                <span className="font-medium">{s.label}</span>
              </Link>

              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="mx-1 h-px w-10 shrink-0 bg-gradient-to-r from-slate-600 to-transparent"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
