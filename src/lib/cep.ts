import { UF } from "@/types/shipping";

export type CepInfo = {
  cep: string;
  uf: UF;
  localidade: string;
  bairro: string;
  logradouro: string;
  prefix3: string;
  label: string;
};

const UF_LIST: readonly UF[] = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

function isUF(value: string): value is UF {
  return UF_LIST.includes(value.toUpperCase() as UF);
}

export async function lookupCep(cep: string): Promise<CepInfo> {
  const only = (cep || "").replace(/\D/g, "");
  if (only.length !== 8) throw new Error("CEP inválido");

  try {
    const r = await fetch(`https://brasilapi.com.br/api/cep/v1/${only}`, {
      cache: "no-store",
    });
    if (r.ok) {
      const d = await r.json();
      const uf = String(d.state ?? "").toUpperCase();
      if (!isUF(uf)) throw new Error("UF inválida");

      return {
        cep: only,
        uf,
        localidade: d.city ?? "",
        bairro: d.neighborhood ?? "",
        logradouro: d.street ?? "",
        prefix3: only.slice(0, 3),
        label:
          [d.street, d.neighborhood, d.city, uf].filter(Boolean).join(", ") ||
          `CEP: ${only}`,
      };
    }
  } catch {}

  const v = await fetch(`https://viacep.com.br/ws/${only}/json/`, {
    cache: "no-store",
  });
  if (!v.ok) throw new Error("Falha ao consultar CEP");
  const d = await v.json();
  if (d.erro) throw new Error("CEP não encontrado");

  const uf = String(d.uf ?? "").toUpperCase();
  if (!isUF(uf)) throw new Error("UF inválida");

  return {
    cep: only,
    uf,
    localidade: d.localidade ?? "",
    bairro: d.bairro ?? "",
    logradouro: d.logradouro ?? "",
    prefix3: only.slice(0, 3),
    label:
      [d.logradouro, d.bairro, d.localidade, uf].filter(Boolean).join(", ") ||
      `CEP: ${only}`,
  };
}
