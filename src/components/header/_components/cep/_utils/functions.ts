import { LocationData } from "@/types/location";
import { formatAddress } from "@/utils/formatAddress";

export function maskCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits.replace(/^(\d{0,5})/, "$1");
  return digits.replace(/^(\d{5})(\d{0,3})$/, "$1-$2");
}

export function unmaskCep(value: string): string {
  return value.replace(/\D/g, "");
}

export function getAddressLabel(
  locationData: LocationData,
  cep: string,
): string {
  if (locationData.logradouro && locationData.localidade) {
    const formatted = formatAddress(locationData);
    if (formatted) return formatted;
  }

  if (locationData.localidade) {
    return `${locationData.localidade}${locationData.uf ? ` - ${locationData.uf}` : ""}`;
  }

  return `CEP: ${maskCep(cep)}`;
}

export async function fetchCepData(cep: string): Promise<LocationData | null> {
  const numericCep = cep.replace(/\D/g, "");

  if (numericCep.length !== 8) {
    throw new Error("CEP deve conter 8 dígitos");
  }

  try {
    const response = await fetch(`/api/cep?cep=${numericCep}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Erro ao consultar CEP");
    }

    const data = await response.json();

    if (data.erro) {
      throw new Error("CEP não encontrado");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro de conexão ao consultar CEP");
  }
}

export async function fetchGeolocationData(
  lat: number,
  lon: number,
): Promise<LocationData | null> {
  try {
    const response = await fetch(`/api/geocode?lat=${lat}&lon=${lon}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Erro ao obter localização");
    }

    const data = await response.json();

    if (!data.cep) {
      throw new Error(
        "Não foi possível determinar o CEP a partir da localização",
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Erro de conexão ao obter localização");
  }
}
