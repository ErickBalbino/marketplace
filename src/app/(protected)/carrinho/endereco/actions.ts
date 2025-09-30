export type CepLookup = {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

export async function lookupCEP(cep: string): Promise<CepLookup | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
      cache: "no-store",
    });
    const json = await res.json();
    if (json.erro) return null;
    return {
      street: json.logradouro ?? "",
      neighborhood: json.bairro ?? "",
      city: json.localidade ?? "",
      state: json.uf ?? "",
    };
  } catch {
    return null;
  }
}

export function maskCEP(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}
