"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  startTransition,
  Fragment,
  useCallback,
} from "react";
import { MapPin, LocateFixed, CheckCircle2, X } from "lucide-react";
import {
  fetchCepData,
  fetchGeolocationData,
  maskCep,
  unmaskCep,
  getAddressLabel,
} from "./_utils/functions";
import { confirmShipTo } from "./actions";
import { useDebounce } from "@/hooks/useDebounce";
import { LocationData } from "@/types/location";
import { ErrorDisplay } from "@/components/layout/error/ErrorDisplay";
import { Button } from "@/components/ui/button";

interface LookupResult {
  cep: string;
  label: string;
  location: LocationData;
}

interface CepModalProps {
  label: React.ReactNode;
}

export function CepModal({ label }: CepModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [cep, setCep] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [actionState, confirmAction, isConfirming] = useActionState(
    async (_: unknown, formData: FormData) => confirmShipTo(_, formData),
    { ok: false, error: null } as unknown as { ok: boolean; error?: string },
  );

  useEffect(() => {
    if (isOpen) {
      setCepError(null);
      setGeoError(null);
    }
  }, [isOpen]);

  const openModal = useCallback(() => {
    setIsOpen(true);
    dialogRef.current?.showModal();
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setCepError(null);
    setGeoError(null);
    dialogRef.current?.close();
  }, []);

  const debouncedCep = useDebounce(cep, 450);

  useEffect(() => {
    const numericCep = unmaskCep(debouncedCep);
    if (numericCep.length !== 8) {
      setResult(null);
      setCepError(null);
      return;
    }

    let isCancelled = false;

    const fetchCepDataAsync = async () => {
      setIsLoadingCep(true);
      setCepError(null);
      try {
        const locationData = await fetchCepData(numericCep);

        if (!isCancelled && locationData) {
          const addressLabel = getAddressLabel(locationData, numericCep);
          setResult({
            cep: numericCep,
            label: addressLabel,
            location: locationData,
          });
        }
      } catch (error) {
        if (!isCancelled) {
          setResult(null);
          setCepError(
            error instanceof Error ? error.message : "Erro ao consultar CEP",
          );
        }
      } finally {
        if (!isCancelled) setIsLoadingCep(false);
      }
    };

    fetchCepDataAsync();

    return () => {
      isCancelled = true;
    };
  }, [debouncedCep]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleBackdropClick = (event: MouseEvent) => {
      const target = event.target as HTMLDialogElement;
      if (target.nodeName === "DIALOG") {
        closeModal();
      }
    };

    dialog.addEventListener("click", handleBackdropClick);
    return () => dialog.removeEventListener("click", handleBackdropClick);
  }, [closeModal]);

  const handleUseLocation = async () => {
    setCepError(null);

    if (!navigator.geolocation) {
      setGeoError("Seu navegador não suporta geolocalização");
      return;
    }

    const permission = await navigator.permissions?.query({
      name: "geolocation",
    });

    if (permission?.state === "denied") {
      setGeoError(`
      Acesso a localização negada`);
      return;
    }

    setIsLoadingGeo(true);
    setGeoError(null);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            maximumAge: 20_000,
            timeout: 12_000,
          });
        },
      );

      const { latitude, longitude } = position.coords;
      const locationData = await fetchGeolocationData(latitude, longitude);

      if (locationData) {
        const addressLabel = getAddressLabel(locationData, locationData.cep);
        setCep(maskCep(locationData.cep));
        setResult({
          cep: locationData.cep,
          label: addressLabel,
          location: locationData,
        });
        setGeoError(null);
      }
    } catch (error) {
      setGeoError(
        error instanceof Error ? error.message : "Erro ao usar localização",
      );
    } finally {
      setIsLoadingGeo(false);
    }
  };

  const handleConfirm = () => {
    if (!result) return;

    const formData = new FormData();
    formData.set("cep", result.cep);
    formData.set("label", result.label);

    startTransition(() => confirmAction(formData));
  };

  useEffect(() => {
    if (actionState.ok) {
      closeModal();
      window.location.reload();
    }
  }, [actionState.ok, closeModal]);

  const isConfirmDisabled =
    !result || isLoadingCep || isLoadingGeo || isConfirming;

  return (
    <Fragment>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-2xl px-3 py-3 text-sm lg:hover:bg-slate-100 cursor-pointer"
        onClick={openModal}
        aria-label="Informe seu CEP para calcular frete e prazos"
      >
        <MapPin size={16} className="text-slate-50 lg:text-brand-700" />
        {label}
      </button>

      <dialog
        ref={dialogRef}
        className={`rounded-3xl p-0 backdrop:bg-black/35 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-[95vw] transition-all duration-150 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="w-[min(92vw,600px)] rounded-2xl bg-white p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Escolher endereço de entrega
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Use sua localização atual ou informe um CEP para calcular frete
                e prazos.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeModal}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Fechar"
            >
              <X size={16} />
            </Button>
          </div>

          <div className="grid gap-4">
            <Button
              type="button"
              onClick={handleUseLocation}
              disabled={isLoadingGeo || isLoadingCep}
              variant="outline"
              className="w-full justify-start h-12"
            >
              <LocateFixed
                size={18}
                className={
                  isLoadingGeo
                    ? "animate-pulse text-brand-700"
                    : "text-brand-700"
                }
              />
              {isLoadingGeo
                ? "Obtendo sua localização…"
                : "Usar minha localização"}
            </Button>

            <div className="flex gap-3">
              <input
                value={cep}
                onChange={(e) => {
                  setCep(maskCep(e.target.value));
                  setCepError(null);
                  setGeoError(null);
                }}
                placeholder="00000-000"
                inputMode="numeric"
                disabled={isLoadingCep || isLoadingGeo}
                className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base outline-none ring-0 placeholder:text-slate-400 focus:border-brand-700 focus:ring-1 focus:ring-brand/30 transition-colors disabled:opacity-60"
                aria-label="Digite seu CEP"
              />
            </div>

            {geoError && (
              <ErrorDisplay
                message={geoError}
                onClose={() => setGeoError(null)}
              />
            )}

            {cepError && (
              <ErrorDisplay
                message={cepError}
                onClose={() => setCepError(null)}
              />
            )}

            {actionState.error && (
              <ErrorDisplay message={actionState.error} type="error" />
            )}

            {result && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 text-emerald-600" size={18} />
                  <div className="leading-tight">
                    <p className="font-medium text-emerald-900">
                      {result.label}
                    </p>
                    <p className="text-xs text-emerald-700">
                      CEP: {maskCep(result.cep)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-2 flex justify-end">
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={isConfirmDisabled}
                className="rounded-2xl bg-brand-800 px-5 py-3 text-sm font-medium text-white hover:bg-brand-900 disabled:opacity-60"
              >
                {isConfirming ? "Confirmando…" : "Confirmar"}
              </Button>
            </div>
          </div>
        </div>
      </dialog>
    </Fragment>
  );
}
