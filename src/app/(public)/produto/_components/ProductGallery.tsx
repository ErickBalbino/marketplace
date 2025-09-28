"use client";

import { SmartImage } from "@/components/SmartImage";

export function ProductGallery({ cover }: { cover: string }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl border h-[90%]">
      <SmartImage
        src={cover}
        alt="Imagem do produto"
        fill
        priority
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
}
