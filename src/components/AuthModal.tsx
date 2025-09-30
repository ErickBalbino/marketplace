"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  action?: "purchase" | "addToCart" | "favorite";
};

export function AuthModal({ isOpen, onClose, action }: AuthModalProps) {
  const actionMessages: Record<string, string> = {
    purchase: "fazer uma compra",
    addToCart: "adicionar produtos ao carrinho",
    favorite: "adicionar aos favoritos",
  };

  function handleRedirect() {
    window.location.href = "/login";
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl animate-in fade-in-0 zoom-in-95"
          aria-describedby="Modal de login necessário"
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-slate-900">
              Login necessário
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-md p-1 hover:bg-slate-100">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <p className="mt-3 text-sm text-slate-600">
            Para {actionMessages[action || "purchase"]}, você precisa acessar
            sua conta.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={handleRedirect}
              className="w-full rounded-lg bg-brand-800 px-4 py-2 text-sm font-medium text-white hover:bg-brand-900 transition"
            >
              Acessar conta
            </button>
            <Dialog.Close asChild>
              <button
                type="button"
                className="w-full rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
