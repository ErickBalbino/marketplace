"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, Heart, LogIn, MapPin, Home, Package, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createPortal } from "react-dom";
import Image from "next/image";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user?: { name?: string; email?: string; avatarUrl?: string };
  categories: string[];
}

export function MobileSidebar({
  isOpen,
  onClose,
  user,
  categories,
}: MobileSidebarProps) {
  const portalRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let portal = document.getElementById("sidebar-portal");
    if (!portal) {
      portal = document.createElement("div");
      portal.id = "sidebar-portal";
      document.body.appendChild(portal);
    }
    portalRef.current = portal;

    return () => {
      if (portal && portal.parentNode) {
        portal.parentNode.removeChild(portal);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const getUserInitials = (name?: string, email?: string) => {
    const search = name?.trim() || email?.trim() || "";
    if (!search) return "U";

    const parts = search.split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  if (!portalRef.current) return null;

  return createPortal(
    <>
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 lg:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link
              href="/"
              className="lg:shrink-0 text-xl font-bold tracking-tight leading-none mx-auto lg:mx-0"
              aria-label="Ir para a home"
              onClick={onClose}
            >
              <Image
                alt="Logo"
                src="/logo.png"
                priority
                width={150}
                height={65}
                className="w-[150px] h-[52px] lg:w-[150px] lg:h-[65px]"
              />
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X size={16} />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {user ? (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                  <Avatar className="h-10 w-10">
                    {user.avatarUrl ? (
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                    ) : (
                      <AvatarFallback className="bg-brand-100 text-brand-700">
                        {getUserInitials(user.name, user.email)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-slate-600 truncate">
                      Minha conta
                    </p>
                  </div>
                </div>
              ) : (
                <Button
                  asChild
                  className="w-full justify-start h-12 bg-brand-700 hover:bg-brand-800"
                >
                  <Link href="/login" onClick={onClose}>
                    <LogIn size={16} className="mr-3" />
                    Acessar conta
                  </Link>
                </Button>
              )}

              <Separator />

              <nav className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 font-normal"
                  asChild
                >
                  <Link href="/" onClick={onClose}>
                    <Home size={16} className="mr-3" />
                    Início
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 font-normal"
                  asChild
                >
                  <Link href="/favoritos" onClick={onClose}>
                    <Heart size={16} className="mr-3" />
                    Favoritos
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 font-normal"
                  asChild
                >
                  <Link href="/pedidos" onClick={onClose}>
                    <Package size={16} className="mr-3" />
                    Meus Pedidos
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 font-normal"
                  asChild
                >
                  <Link href="/configuracoes" onClick={onClose}>
                    <Settings size={16} className="mr-3" />
                    Configurações
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 font-normal"
                >
                  <MapPin size={16} className="mr-3" />
                  Alterar CEP
                </Button>
              </nav>

              <Separator />

              <div>
                <h3 className="font-semibold text-sm mb-3">Departamentos</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant="ghost"
                      className="w-full justify-start h-10 font-normal text-sm"
                      asChild
                    >
                      <Link
                        href={`/categoria/${category.toLowerCase()}`}
                        onClick={onClose}
                      >
                        {category}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="text-center text-xs text-slate-500">
              <span className="font-semibold text-brand-800">Market</span>place
            </div>
          </div>
        </div>
      </div>
    </>,
    portalRef.current,
  );
}
