import Image from "next/image";

export type Product = {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
};

export function ProductCard({ product }: { product: Product }) {
  const price = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(product.price);
  return (
    <article className="min-w-[220px] snap-start rounded-lg border p-3 shadow-card transition hover:-translate-y-0.5 hover:shadow dark:border-slate-800">
      <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-slate-50 dark:bg-slate-900">
        <Image
          src={product.imageUrl ?? "/next.svg"}
          alt={product.title}
          fill
          sizes="220px"
          className="object-contain p-6"
        />
      </div>
      <h3 className="line-clamp-2 text-sm font-medium">{product.title}</h3>
      <div className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
        {price}
      </div>
      <div className="mt-3">
        <a
          href={`/produto/${product.id}`}
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
        >
          Ver detalhes
        </a>
      </div>
    </article>
  );
}
