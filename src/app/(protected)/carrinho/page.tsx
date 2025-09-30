import CartView from "./_components/CartView";
import { CheckoutStepper } from "@/components/cart/CheckoutStepper";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  return (
    <div>
      <CheckoutStepper current="cart" />

      <section aria-labelledby="cart-title" className="min-w-0">
        <div className="mx-auto max-w-5xl">
          <CartView />
        </div>
      </section>
    </div>
  );
}
