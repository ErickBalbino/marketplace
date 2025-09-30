"use client";

import { slides } from "@/data/slides";
import HeroCarousel from "./HeroCarousel";
import { usePathname } from "next/navigation";

export default function HeroContainer() {
  const pathname = usePathname();
  const regex = /^\/$/;
  const isHome = regex.test(pathname);

  if (isHome) {
    return (
      <div className="-mx-3 sm:mx-0">
        <div className="h-[120px]"></div>

        <HeroCarousel
          slides={
            slides as unknown as Array<{
              id: string;
              src: string;
              alt: string;
              href?: string;
              priority?: boolean;
            }>
          }
        />
      </div>
    );
  }

  return <></>;
}
