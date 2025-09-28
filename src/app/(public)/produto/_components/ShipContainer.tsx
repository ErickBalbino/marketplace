"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { ShippingQuoteResponse } from "@/types/shipping";
import { maskCep } from "@/components/header/_components/cep/_utils/functions";

type ShipTo = { cep: string; label?: string } | null;

type Props = {
  shipTo: ShipTo;
  item: { id: string; price: number; weightKg?: number };
};

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-5 w-40 rounded bg-slate-200" />
      <div className="h-4 w-64 rounded bg-slate-200" />
      <div className="h-10 w-full rounded-xl bg-slate-200" />
      <div className="h-4 w-36 rounded bg-slate-200" />
    </div>
  );
}

export function ShipContainer({ shipTo, item }: Props) {
  const [cep, setCep] = useState(maskCep(shipTo?.cep ?? ""));
  const [quote, setQuote] = useState<ShippingQuoteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const hasCep = useMemo(() => cep.replace(/\D/g, "").length === 8, [cep]);

  async function requestQuote(toCep: string) {
    setError(null);
    setQuote(null);
    try {
      const r = await fetch("/api/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationCep: toCep.replace(/\D/g, ""),
          items: [
            { id: item.id, qty: 1, price: item.price, weightKg: item.weightKg },
          ],
        }),
      });
      if (!r.ok) throw new Error("Falha ao consultar frete");
      const data = (await r.json()) as ShippingQuoteResponse;
      setQuote(data);
    } catch {
      setError("Erro ao calcular frete");
    }
  }

  useEffect(() => {
    const only = cep.replace(/\D/g, "");
    if (only.length === 8 && shipTo?.cep) {
      startTransition(() => requestQuote(only));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipTo?.cep]);

  const onConsultar = () => {
    const only = cep.replace(/\D/g, "");
    if (only.length !== 8) {
      setError("Digite um CEP válido");
      return;
    }
    startTransition(() => requestQuote(only));
  };

  return (
    <div className="rounded-2xl border p-5">
      <h3 className="text-lg font-semibold">Calcule frete e prazo</h3>

      {shipTo?.label ? (
        <p className="mt-1 text-sm text-slate-600">
          Entrega para <span className="font-medium">{shipTo.label}</span>
        </p>
      ) : (
        <p className="mt-1 text-sm text-slate-600">
          Informe seu CEP para calcular o frete e o prazo de entrega.
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <input
          value={cep}
          onChange={(e) => setCep(maskCep(e.target.value))}
          placeholder="00000-000"
          inputMode="numeric"
          className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-brand-700 focus:ring-2 focus:ring-brand/30 disabled:opacity-60"
          disabled={isPending}
        />
        <button
          type="button"
          onClick={onConsultar}
          disabled={isPending || !hasCep}
          className="rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-900 disabled:opacity-60"
        >
          {isPending ? "Consultando…" : "Consultar"}
        </button>
      </div>

      {isPending && (
        <div className="mt-4">
          <Skeleton />
        </div>
      )}

      {error && <p className="mt-3 text-sm text-error-600">{error}</p>}

      {quote && !isPending && (
        <div className="mt-4 space-y-3">
          {quote.options.map((op) => (
            <div
              key={op.service}
              className="rounded-xl border p-3 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{op.service}</div>
                <div className="text-sm text-slate-600">
                  {op.deadlineDays.min}–{op.deadlineDays.max} dias úteis
                </div>
              </div>
              <div className="text-right">
                {op.free ? (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 text-sm">
                    Frete grátis
                  </span>
                ) : (
                  <span className="text-base font-semibold">
                    {op.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
