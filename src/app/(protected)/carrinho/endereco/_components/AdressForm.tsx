"use client";

import { useEffect, useMemo, useState } from "react";
import { useCheckout, type Address } from "@/contexts/CheckoutContext";
import { brl } from "@/utils/formatCurrency";
import Link from "next/link";
import { lookupCEP, maskCEP } from "../actions";
import { freightOptions } from "@/data/freight";
import { useCart } from "@/contexts/CartContext";

export function AddressForm({ initialCep = "" }: { initialCep?: string }) {
  const { address, freight, setFreight } = useCheckout();
  const { cart } = useCart();

  const [options, setOptions] = useState<typeof freightOptions>([]);
  const [cep, setCep] = useState(initialCep ? maskCEP(initialCep) : "");
  const [street, setStreet] = useState(address?.street ?? "");
  const [number, setNumber] = useState(address?.number ?? "");
  const [complement, setComplement] = useState(address?.complement ?? "");
  const [neighborhood, setNeighborhood] = useState(address?.neighborhood ?? "");
  const [city, setCity] = useState(address?.city ?? "");
  const [state, setState] = useState(address?.state ?? "");
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");

  const isCepValid = useMemo(() => {
    const digits = cep.replace(/\D/g, "");
    return digits.length === 8;
  }, [cep]);

  useEffect(() => {
    const searchCep = async () => {
      if (!isCepValid) {
        setOptions([]);
        setCepError("");
        return;
      }

      setLoadingCep(true);
      setCepError("");

      try {
        const result = await lookupCEP(cep);

        if (result) {
          setStreet(result.street || "");
          setNeighborhood(result.neighborhood || "");
          setCity(result.city || "");
          setState(result.state || "");

          setOptions(freightOptions);
        } else {
          setCepError("CEP não encontrado");
          setOptions([]);
        }
      } catch (error) {
        setCepError("Erro ao buscar CEP");
        setOptions([]);
        console.error("CEP search error:", error);
      } finally {
        setLoadingCep(false);
      }
    };

    const timeoutId = setTimeout(searchCep, 500);
    return () => clearTimeout(timeoutId);
  }, [cep, isCepValid]);

  useEffect(() => {
    if (initialCep && isCepValid) {
      const searchInitialCep = async () => {
        setLoadingCep(true);
        try {
          const result = await lookupCEP(initialCep);
          if (result) {
            setStreet(result.street || "");
            setNeighborhood(result.neighborhood || "");
            setCity(result.city || "");
            setState(result.state || "");
            setOptions(freightOptions);
          }
        } catch (error) {
          console.error("Initial CEP search error:", error);
        } finally {
          setLoadingCep(false);
        }
      };
      searchInitialCep();
    }
  }, [initialCep, isCepValid]);

  function snapshot(): Address | null {
    const cleanCEP = cep.replace(/\D/g, "");
    if (
      cleanCEP.length !== 8 ||
      !street.trim() ||
      !number.trim() ||
      !neighborhood.trim() ||
      !city.trim() ||
      !state.trim()
    )
      return null;

    return {
      cep: cleanCEP,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
    };
  }

  const validAddress = useMemo(
    () => !!snapshot(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cep, street, number, complement, neighborhood, city, state],
  );

  const handleCepChange = (value: string) => {
    const masked = maskCEP(value);
    setCep(masked);

    const digits = masked.replace(/\D/g, "");
    if (digits.length < 8) {
      setOptions([]);
      setCepError("");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-2xl border p-5">
        <h2 className="text-lg font-semibold">Endereço de entrega</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium">CEP</label>
            <input
              value={cep}
              onChange={(e) => handleCepChange(e.target.value)}
              inputMode="numeric"
              placeholder="00000-000"
              className="mt-1 w-full rounded-lg border border-slate-400 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand/30"
            />
            {loadingCep && (
              <p className="mt-1 text-xs text-slate-500">Buscando CEP…</p>
            )}
            {cepError && (
              <p className="mt-1 text-xs text-red-500">{cepError}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Rua</label>
            <input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-400 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Número</label>
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-400 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Complemento</label>
            <input
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-400 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Bairro</label>
            <input
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-400 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Cidade</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-400 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">UF</label>
            <input
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
              maxLength={2}
              className="mt-1 w-full rounded-lg border border-slate-400 px-3 py-2 text-sm uppercase outline-none focus:ring-1 focus:ring-brand/30"
            />
          </div>
        </div>

        {options.length > 0 && (
          <div className="mt-10">
            <h3 className="mb-2 text-lg font-semibold text-slate-700">
              Escolha o frete
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {options.map((opt) => {
                const active = freight?.service === opt.service;
                return (
                  <label
                    key={opt.service}
                    className={[
                      "flex cursor-pointer items-center justify-between rounded-xl border p-3 transition border-slate-400",
                      active
                        ? "border-brand-300 bg-brand-50 ring-1 ring-brand-300"
                        : "border-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <div>
                      <div className="text-sm font-semibold">{opt.service}</div>
                      <div className="text-xs text-slate-600">
                        {opt.etaDays} dia{opt.etaDays > 1 ? "s" : ""} úteis
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold">
                        {brl(opt.price)}
                      </div>
                      <input
                        type="radio"
                        name="freight"
                        checked={active}
                        onChange={() => setFreight(opt)}
                        aria-label={`Selecionar ${opt.service}`}
                      />
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-24 lg:h-fit rounded-2xl border p-5">
        <h3 className="text-lg font-semibold">Próxima etapa</h3>
        <p className="mt-1 text-sm text-slate-600">
          Revise o endereço e prossiga para o pagamento.
        </p>

        {freight && (
          <div className="mt-3">
            <ul className="space-y-2">
              <li className="flex justify-between">
                <p>Subtotal</p>
                <p>{brl(cart.total)}</p>
              </li>
              {options.length >= 1 && (
                <li className="flex justify-between">
                  <p>Frete</p>
                  <p>{brl(freight.price)}</p>
                </li>
              )}
            </ul>
          </div>
        )}

        <Link
          href="/carrinho/checkout"
          aria-disabled={!validAddress || cepError.length >= 1}
          className="mt-4 block rounded-xl bg-brand-800 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-900 aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          Prosseguir
        </Link>
      </aside>
    </div>
  );
}
