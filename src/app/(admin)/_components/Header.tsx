"use client";
import { signOut } from "@/components/header/actions";
import { LogOut } from "lucide-react";
import Image from "next/image";

export function AdminHeader({ onSearch }: { onSearch: (q: string) => void }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-white">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="AllMarket" width={110} height={40} />
          <span className="rounded-full bg-brand-400 px-2 py-1 text-xs font-medium text-slate-100">
            Admin
          </span>
        </div>

        <input
          type="search"
          placeholder="Buscar produtos…"
          className="w-full max-w-md rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand/30"
          onChange={(e) => onSearch(e.target.value)}
        />

        <button
          onClick={signOut}
          className="rounded-xl border px-3 py-2 text-sm hover:bg-slate-100 flex items-center cursor-pointer"
          aria-label="Fazer logout"
        >
          <LogOut size={16} className="mr-3" /> Sair
        </button>
      </div>
    </header>
  );
}
