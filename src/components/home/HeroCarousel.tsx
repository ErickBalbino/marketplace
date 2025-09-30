"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  id: string;
  src: string;
  alt: string;
  href?: string;
  priority?: boolean;
};

type Props = {
  slides: Slide[];
  intervalMs?: number;
  className?: string;
};

export default function HeroCarousel({
  slides,
  intervalMs = 6000,
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const count = slides.length;
  const current = useMemo(() => slides[index], [slides, index]);

  const goto = useCallback(
    (next: number) => {
      if (count === 0) return;
      const n = (next + count) % count;
      setIndex(n);
    },
    [count],
  );

  const next = useCallback(() => goto(index + 1), [goto, index]);
  const prev = useCallback(() => goto(index - 1), [goto, index]);

  const stop = useCallback(() => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (timer.current || count <= 1) return;
    timer.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
  }, [count, intervalMs]);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onEnter = () => stop();
    const onLeave = () => start();

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("focusin", onEnter);
    el.addEventListener("focusout", onLeave);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("focusin", onEnter);
      el.removeEventListener("focusout", onLeave);
    };
  }, [start, stop]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  if (count === 0) return null;

  const SlideContent = (
    <div className="relative h-[200px] lg:h-[350px] w-full">
      <Image
        src={current.src}
        alt={current.alt}
        fill
        sizes="100vw"
        priority={current.priority}
        className="object-cover object-center"
      />

      <div className="absolute inset-x-0 bottom-0 h-24  pointer-events-none" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 sm:px-3">
        <button
          type="button"
          aria-label="Anterior"
          onClick={prev}
          className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-white/80 p-2 text-slate-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand/40"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          aria-label="Próximo"
          onClick={next}
          className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-white/80 p-2 text-slate-700 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand/40"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="Destaques e ofertas"
      className={`relative mx-auto w-full overflow-hidden h-[200px] lg:h-[350px] bg-slate-100 ${className}`}
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      <div className="relative aspect-[16/6] max-sm:aspect-[16/9]">
        {SlideContent}
      </div>

      <p aria-live="polite" className="sr-only">
        Slide {index + 1} de {count}: {current.alt}
      </p>
    </section>
  );
}
