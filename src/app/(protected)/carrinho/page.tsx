import CartView from "./_components/CartView";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  return (
    <div className="container py-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section aria-labelledby="cart-title" className="min-w-0">
          <h1
            id="cart-title"
            className="mb-4 text-2xl font-semibold tracking-tight"
          >
            Meu carrinho
          </h1>
          <CartView />
        </section>
        <aside className="lg:sticky lg:top-24 lg:h-fit" />
      </div>
    </div>
  );
}
