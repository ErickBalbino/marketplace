import type {
  MacroRegion,
  ShippingItem,
  ShippingOption,
  ShippingQuoteResponse,
  UF,
  Zone,
} from "@/types/shipping";
import { lookupCep, type CepInfo } from "@/lib/cep";

const STORE_ORIGIN_CEP = process.env.STORE_ORIGIN_CEP ?? "01001000";
const FREE_MIN = Number(process.env.FREE_SHIPPING_MIN ?? 1550);

const MACRO: Record<Exclude<MacroRegion, "Outros">, readonly UF[]> = {
  Norte: ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
  Nordeste: ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
  CentroOeste: ["GO", "MT", "MS", "DF"],
  Sudeste: ["ES", "MG", "RJ", "SP"],
  Sul: ["PR", "RS", "SC"],
};

function macroRegiao(uf: UF): MacroRegion {
  for (const [k, list] of Object.entries(MACRO) as [
    MacroRegion,
    readonly UF[],
  ][]) {
    if (list.includes(uf)) return k;
  }
  return "Outros";
}

function classifyZone(origin: CepInfo, dest: CepInfo): Zone {
  if (origin.localidade === dest.localidade) return "urbano";
  if (origin.prefix3 === dest.prefix3 && origin.uf === dest.uf)
    return "regional";
  if (origin.uf === dest.uf) return "estadual";
  const macroO = macroRegiao(origin.uf);
  const macroD = macroRegiao(dest.uf);
  if (macroO === macroD) return "interestadual_proximo";
  return "interestadual_longo";
}

const ZONE_FACTORS: Record<Zone, number> = {
  urbano: 1.0,
  regional: 1.1,
  estadual: 1.25,
  interestadual_proximo: 1.5,
  interestadual_longo: 1.8,
};

const ZONE_DEADLINES: Record<
  Zone,
  { normal: [number, number]; expresso: [number, number] }
> = {
  urbano: { normal: [2, 3], expresso: [1, 2] },
  regional: { normal: [3, 5], expresso: [2, 3] },
  estadual: { normal: [4, 7], expresso: [2, 4] },
  interestadual_proximo: { normal: [5, 9], expresso: [3, 5] },
  interestadual_longo: { normal: [7, 12], expresso: [4, 7] },
};

export async function quoteShipping(
  destinationCep: string,
  items: ShippingItem[],
): Promise<ShippingQuoteResponse> {
  const origin = await lookupCep(STORE_ORIGIN_CEP);
  const destination = await lookupCep(destinationCep);

  const zone = classifyZone(origin, destination);

  const totalWeight = items.reduce<number>(
    (s, it) => s + (it.weightKg ?? 1.2) * it.qty,
    0,
  );
  const subtotal = items.reduce<number>((s, it) => s + it.price * it.qty, 0);

  const base = 8.9;
  const kg = 4.5;
  const factor = ZONE_FACTORS[zone];
  const normalPrice = (base + kg * totalWeight) * factor;

  const free = subtotal >= FREE_MIN && zone !== "interestadual_longo";

  const [nMin, nMax] = ZONE_DEADLINES[zone].normal;
  const [eMin, eMax] = ZONE_DEADLINES[zone].expresso;

  const normal: ShippingOption = {
    service: "Normal",
    price: free ? 0 : round(normalPrice),
    deadlineDays: { min: nMin, max: nMax },
    free,
  };

  const expresso: ShippingOption = {
    service: "Expresso",
    price: free ? 0 : round(normalPrice * 1.6),
    deadlineDays: { min: eMin, max: eMax },
    free,
  };

  return {
    origin: { cep: origin.cep, label: origin.label },
    destination: { cep: destination.cep, label: destination.label },
    items,
    totalItemsWeightKg: Number(totalWeight.toFixed(2)),
    subtotal: round(subtotal),
    options: [normal, expresso],
    zone,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
