// components/header/ScrollWrapper.tsx
"use client";

import { useState, useEffect } from "react";

interface ScrollWrapperProps {
  children: React.ReactNode;
}

export function ScrollWrapper({ children }: ScrollWrapperProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => window.removeEventListener("scroll", throttledScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`
      fixed top-0 left-0 right-0 z-50 
      transition-transform duration-300 ease-in-out
      ${isVisible ? "translate-y-0" : "-translate-y-full"}
    `}
    >
      {children}
    </div>
  );
}
