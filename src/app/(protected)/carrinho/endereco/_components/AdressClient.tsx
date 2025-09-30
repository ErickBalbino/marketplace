"use client";

import { CheckoutProvider } from "@/contexts/CheckoutContext";
import { AddressForm } from "./AdressForm";

export default function AddressClient({
  initialCep = "",
}: {
  initialCep?: string;
}) {
  return (
    <CheckoutProvider>
      <AddressForm initialCep={initialCep} />
    </CheckoutProvider>
  );
}
