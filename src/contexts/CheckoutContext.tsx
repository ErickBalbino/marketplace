"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Address = {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
};

export type FreightOption = {
  service: string;
  price: number;
  etaDays: number;
};

type Ctx = {
  address: Address | null;
  setAddress: (a: Address | null) => void;
  freight: FreightOption | null;
  setFreight: (f: FreightOption | null) => void;
  clear: () => void;
};

const CheckoutCtx = createContext<Ctx | undefined>(undefined);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddressState] = useState<Address | null>(null);
  const [freight, setFreightState] = useState<FreightOption | null>(null);

  useEffect(() => {
    try {
      const a = localStorage.getItem("checkout_address");
      const f = localStorage.getItem("checkout_freight");
      if (a) setAddressState(JSON.parse(a));
      if (f) setFreightState(JSON.parse(f));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (address)
        localStorage.setItem("checkout_address", JSON.stringify(address));
      else localStorage.removeItem("checkout_address");
    } catch {}
  }, [address]);

  useEffect(() => {
    try {
      if (freight)
        localStorage.setItem("checkout_freight", JSON.stringify(freight));
      else localStorage.removeItem("checkout_freight");
    } catch {}
  }, [freight]);

  const setAddress = useCallback((a: Address | null) => setAddressState(a), []);
  const setFreight = useCallback(
    (f: FreightOption | null) => setFreightState(f),
    [],
  );
  const clear = useCallback(() => {
    setAddressState(null);
    setFreightState(null);
  }, []);

  const value = useMemo(
    () => ({ address, setAddress, freight, setFreight, clear }),
    [address, freight, setAddress, setFreight, clear],
  );
  return <CheckoutCtx.Provider value={value}>{children}</CheckoutCtx.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutCtx);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}
