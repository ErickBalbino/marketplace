"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

type Category = {
  id: string;
  name: string;
  image: string;
};

const CATEGORIES: Category[] = [
  { id: "c1", name: "Smartphones", image: "/category-headphone.png" },
  { id: "c2", name: "Notebooks", image: "/category-notebooks.jpg" },
  { id: "c3", name: "TVs", image: "/category-tv.png" },
  { id: "c4", name: "Áudio", image: "/category-headphone.png" },
  { id: "c5", name: "Periféricos", image: "/category-pheripherals.png" },
  { id: "c6", name: "Casa & Cozinha", image: "/category-kitchen.png" },
  { id: "c7", name: "Gamer", image: "/category-gamer.png" },
  { id: "c8", name: "Wearables", image: "/category-wearables.png" },
];

export function CategoryCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  function updateButtons() {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }

  function scrollByDir(dir: "left" | "right") {
    const el = ref.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.75);
    el.scrollBy({ left: dir === "left" ? -delta : delta, behavior: "smooth" });
    window.setTimeout(updateButtons, 280);
  }

  return (
    <section
      aria-label="Categorias"
      className="relative isolate my-12 overflow-hidden"
    >
      <div className="px-3 py-3 sm:px-4 sm:py-4">
        <div
          ref={ref}
          onScroll={updateButtons}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none"
          role="list"
          aria-label="Carrossel de categorias"
        >
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              role="listitem"
              href={`/?q=${encodeURIComponent(c.name)}`}
              className="group relative inline-flex w-40 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border bg-white transition hover:-translate-y-0.5 hover:shadow"
            >
              <div className="relative h-32 w-full overflow-hidden">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover transition-transform duration-300 h-[250px] w-[250px]"
                />
              </div>
              <div className="p-1 text-sm font-medium bg-brand-800 text-white text-center">
                {c.name}
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" />

      <div className="absolute inset-y-0 left-1 flex items-center">
        <button
          type="button"
          aria-label="Categorias anteriores"
          onClick={() => scrollByDir("left")}
          disabled={!canLeft}
          className="pointer-events-auto inline-flex size-9 items-center justify-center rounded-full border bg-white shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>
      </div>
      <div className="absolute inset-y-0 right-1 flex items-center">
        <button
          type="button"
          aria-label="Mais categorias"
          onClick={() => scrollByDir("right")}
          disabled={!canRight}
          className="pointer-events-auto inline-flex size-9 items-center justify-center rounded-full border bg-white shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
