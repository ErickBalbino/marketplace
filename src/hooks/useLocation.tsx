"use client";

import { useState, useCallback } from "react";
import { LocationData } from "@/types/Location";

export function useLocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation =
    useCallback(async (): Promise<LocationData | null> => {
      if (!navigator.geolocation) {
        throw new Error("Seu navegador não suporta geolocalização");
      }

      setLoading(true);
      setError(null);

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
        const response = await fetch(
          `/api/geocode?lat=${latitude}&lon=${longitude}`,
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Não foi possível obter endereço");
        }

        const locationData = await response.json();
        const numericCep = (locationData?.cep || "").replace(/\D/g, "");

        if (!numericCep || numericCep.length !== 8) {
          throw new Error("CEP inválido retornado da localização");
        }

        const result: LocationData = {
          cep: numericCep,
          logradouro: locationData?.logradouro,
          bairro: locationData?.bairro,
          localidade: locationData?.localidade,
          uf: locationData?.uf,
        };

        return result;
      } catch (error) {
        let errorMessage = "Erro ao obter localização";

        if (error instanceof Error) {
          if (error.name === "TimeoutError") {
            errorMessage = "Tempo limite excedido ao obter localização";
          } else if (error.name === "PositionUnavailableError") {
            errorMessage = "Localização indisponível";
          } else if (error.name === "PermissionDeniedError") {
            errorMessage = "Permissão de localização negada";
          } else {
            errorMessage = error.message;
          }
        }

        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    getCurrentLocation,
    resetError,
  };
}
