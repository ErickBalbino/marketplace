"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import type { Product } from "@/types/product";
import { toast } from "sonner";
import { IMaskInput } from "react-imask";
import { X, ImagePlus, UploadCloud, RefreshCcw } from "lucide-react";

type Props = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onSaved: (p: Product) => void;
};

function parseMaskedBRLToNumber(masked: string): number {
  const clean = masked
    .replace(/[^\d,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = Number(clean);
  return Number.isFinite(n) ? n : 0;
}

function formatPriceToMask(price: number): string {
  return price.toFixed(2).replace(".", ",");
}

export function EditProductModal({ open, product, onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [priceMasked, setPriceMasked] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dirty, setDirty] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : product?.imageUrl || ""),
    [image, product?.imageUrl],
  );

  useEffect(() => {
    if (product && open) {
      setName(product.name || "");
      setDesc(product.description || "");
      setPriceMasked(formatPriceToMask(product.price || 0));
      setImage(null);
      setDirty(false);
    }
  }, [product, open]);

  useEffect(() => {
    return () => {
      if (image && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, image]);

  const closeAndReset = useCallback(() => {
    setName("");
    setDesc("");
    setPriceMasked("");
    setImage(null);
    setBusy(false);
    setDirty(false);
    onClose();
  }, [onClose]);

  if (!open || !product) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !desc.trim() || !priceMasked) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    setBusy(true);
    try {
      const priceNumber = parseMaskedBRLToNumber(priceMasked);

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", desc.trim());
      formData.append("price", priceNumber.toString());

      if (image) {
        formData.append("image", image);
      }

      console.log("Atualizando produto via FormData:", {
        id: product?.id,
        name: name.trim(),
        description: desc.trim(),
        price: priceNumber,
        imageChanged: !!image,
      });

      const res = await fetch(`/api/admin/products/${product?.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        let errorDetail = "";
        try {
          const errorText = await res.text();
          errorDetail = errorText;
          console.error("Error response:", res.status, errorText);
        } catch {}

        if (res.status === 413) {
          toast.error("Imagem muito grande. Tente uma imagem menor.");
        } else if (res.status === 401) {
          toast.error("Não autorizado - faça login novamente");
        } else if (res.status === 400) {
          toast.error("Dados inválidos - verifique os campos preenchidos");
        } else if (res.status === 500) {
          toast.error(
            "Erro interno do servidor - verifique os logs do backend",
          );
          console.error("Backend error details:", errorDetail);
        } else {
          toast.error(`Falha ao atualizar produto (${res.status})`);
        }
        return;
      }

      const updated = await res.json();
      toast.success("Produto atualizado com sucesso!");
      onSaved(updated);
      closeAndReset();
    } catch (error) {
      console.error("Update product error:", error);
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setBusy(false);
    }
  }

  function onFileSelect(file?: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Envie um arquivo de imagem válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Imagem muito grande (máx. 5MB)");
      return;
    }

    setImage(file);
    setDirty(true);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    onFileSelect(e.target.files?.[0] ?? null);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    onFileSelect(file);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!dragOver) setDragOver(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }

  function openPicker() {
    fileInputRef.current?.click();
  }

  const handleFieldChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    setter(value);
    setDirty(true);
  };

  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center bg-black/30 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Editar produto"
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl"
      >
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Editar produto</h3>
          <button
            type="button"
            onClick={closeAndReset}
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className={[
              "relative flex aspect-[4/3] w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border",
              dragOver
                ? "border-brand-700 bg-brand-50/40"
                : "border-slate-300 bg-slate-50",
            ].join(" ")}
            onClick={openPicker}
            aria-label="Selecionar imagem do produto"
            role="button"
          >
            {!previewUrl ? (
              <div className="pointer-events-none flex flex-col items-center text-slate-600">
                <UploadCloud size={28} className="mb-2" />
                <p className="text-sm font-medium">
                  Arraste e solte uma imagem
                </p>
                <p className="text-xs">ou clique para selecionar</p>
                <p className="mt-2 text-[11px] text-slate-500">
                  JPG, PNG ou WEBP (máx. 5MB)
                </p>
              </div>
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Pré-visualização"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition hover:bg-black/20" />
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPicker();
                    }}
                    className="pointer-events-auto inline-flex items-center gap-1 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-800 shadow hover:bg-white"
                    aria-label="Trocar imagem"
                  >
                    <RefreshCcw size={14} />
                    Trocar
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImage(null);
                      setDirty(true);
                    }}
                    className="pointer-events-auto inline-flex items-center gap-1 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-medium text-rose-700 shadow hover:bg-white"
                    aria-label="Remover imagem"
                  >
                    <ImagePlus size={14} />
                    Remover
                  </button>
                </div>
                {!image && product?.imageUrl && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Imagem atual
                    </span>
                  </div>
                )}
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Nome</label>
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand/30"
              value={name}
              onChange={(e) => handleFieldChange(setName, e.target.value)}
              placeholder="Ex.: iPhone 15"
              required
            />

            <label className="mt-3 block text-sm font-medium">Descrição</label>
            <textarea
              className="mt-1 w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand/30"
              rows={5}
              value={desc}
              onChange={(e) => handleFieldChange(setDesc, e.target.value)}
              placeholder="Fale sobre o produto…"
              required
            />

            <label className="mt-3 block text-sm font-medium">Preço</label>
            <div className="mt-1 flex items-center rounded-lg border px-3 py-2 focus-within:ring-1 focus-within:ring-brand/30">
              <span className="mr-2 text-slate-500">R$</span>
              <IMaskInput
                mask={Number}
                scale={2}
                thousandsSeparator="."
                radix=","
                mapToRadix={["."]}
                value={priceMasked}
                unmask={false}
                onAccept={(val: unknown) =>
                  handleFieldChange(setPriceMasked, String(val ?? ""))
                }
                className="w-full text-sm outline-none"
                placeholder="0,00"
                inputMode="numeric"
                aria-label="Preço em reais"
              />
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-600">
                <strong>Dica:</strong> A imagem só será atualizada se você
                selecionar um novo arquivo. Deixe em branco para manter a imagem
                atual.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeAndReset}
            className="cursor-pointer rounded-lg border px-4 py-2 text-sm hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-brand-800 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-900 disabled:opacity-50"
            disabled={!dirty || busy}
          >
            {busy ? "Salvando…" : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
