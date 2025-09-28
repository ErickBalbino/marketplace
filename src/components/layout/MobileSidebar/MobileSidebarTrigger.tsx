"use client";

import { MobileSidebar } from "@/components/layout/MobileSidebar/MobileSidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

interface MobileSidebarTriggerProps {
  user?: { name?: string; email?: string; avatarUrl?: string };
  categories: string[];
}

export function MobileSidebarTrigger({
  user,
  categories,
}: MobileSidebarTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="w-[25dvw] flex items-start justify-start pl-2 lg:hidden">
        <Menu
          size={22}
          className="lg:hidden"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu"
        />
      </div>

      <MobileSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        user={user}
        categories={categories}
      />
    </>
  );
}
