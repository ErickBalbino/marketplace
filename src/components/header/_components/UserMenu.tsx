// src/components/header/UserMenu.tsx
"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import {
  Heart,
  LogOut,
  Package,
  Settings,
  User as UserIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "../actions";

type Props = {
  name: string;
  email: string;
  avatarUrl?: string;
};

function initials(nameOrEmail: string) {
  const search = nameOrEmail?.trim() || "";
  if (!search) return "U";
  const parts = search.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserMenu({ name, email, avatarUrl }: Props) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full p-0"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={scheduleClose}
          aria-label="Abrir menu do usuário"
        >
          <Avatar className="h-10 w-10">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={name} />
            ) : (
              <AvatarFallback className="bg-brand-800 text-white">
                {initials(name || email)}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-xl"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        <DropdownMenuLabel className="flex flex-col">
          <span className="truncate font-medium">{name}</span>
          <span className="truncate text-xs text-slate-500">{email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/conta" className="flex w-full items-center gap-2">
            <UserIcon size={16} />
            Meu perfil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/conta/pedidos"
            className="flex w-full items-center gap-2"
          >
            <Package size={16} />
            Meus pedidos
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/favoritos" className="flex w-full items-center gap-2">
            <Heart size={16} />
            Favoritos
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/conta/configuracoes"
            className="flex w-full items-center gap-2"
          >
            <Settings size={16} />
            Configurações
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <form action={signOut}>
          <DropdownMenuItem asChild>
            <button
              type="submit"
              className="flex w-full items-center gap-2 text-red-600"
            >
              <LogOut size={16} />
              Sair
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
