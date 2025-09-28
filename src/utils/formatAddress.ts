import { LocationData } from "@/types/Location";

export function formatAddress(location: LocationData): string {
  const parts = [];

  if (location.logradouro?.trim()) {
    parts.push(location.logradouro.trim());
  }

  if (location.bairro?.trim()) {
    parts.push(location.bairro.trim());
  }

  if (location.localidade?.trim()) {
    const cityState = location.uf?.trim()
      ? `${location.localidade.trim()} - ${location.uf.trim()}`
      : location.localidade.trim();
    parts.push(cityState);
  }

  return parts.join(", ");
}
