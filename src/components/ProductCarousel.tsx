"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types/product";

export function ProductCarousel({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  const ref = useRef<HTMLUListElement>(null);

  function scrollBy(dx: number) {
    ref.current?.scrollBy({ left: dx, behavior: "smooth" });
  }

  return (
    <section className="mb-8">
      <header className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="hidden gap-2 md:flex">
          <button
            aria-label="Anterior"
            onClick={() => scrollBy(-320)}
            className="rounded-md border px-2 py-1 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Próximo"
            onClick={() => scrollBy(320)}
            className="rounded-md border px-2 py-1 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </header>

      <ul
        ref={ref}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        aria-roledescription="carousel"
        aria-label={`Carrossel: ${title}`}
      >
        {products.map((p) => (
          <li key={p.id} className="snap-start">
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
