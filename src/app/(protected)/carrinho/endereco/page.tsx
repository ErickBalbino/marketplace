import { cookies } from "next/headers";
import AddressClient from "./_components/AdressClient";
import { CheckoutStepper } from "@/components/cart/CheckoutStepper";

export default async function AddressPage() {
  const jar = await cookies();
  const raw = jar.get("ship_to")?.value ?? null;

  let initialCep = "";
  try {
    const decoded = raw ? decodeURIComponent(raw) : null;
    const parsed = decoded ? JSON.parse(decoded) : null;
    initialCep = parsed?.cep ?? "";
  } catch {}

  return (
    <>
      <CheckoutStepper current="address" />
      <div className="mx-auto max-w-5xl">
        <AddressClient initialCep={initialCep} />
      </div>
    </>
  );
}
