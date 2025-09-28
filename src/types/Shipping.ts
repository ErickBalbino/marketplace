export type UF =
  | "AC"
  | "AL"
  | "AP"
  | "AM"
  | "BA"
  | "CE"
  | "DF"
  | "ES"
  | "GO"
  | "MA"
  | "MT"
  | "MS"
  | "MG"
  | "PA"
  | "PB"
  | "PR"
  | "PE"
  | "PI"
  | "RJ"
  | "RN"
  | "RS"
  | "RO"
  | "RR"
  | "SC"
  | "SP"
  | "SE"
  | "TO";

export type MacroRegion =
  | "Norte"
  | "Nordeste"
  | "CentroOeste"
  | "Sudeste"
  | "Sul"
  | "Outros";

export type Zone =
  | "urbano"
  | "regional"
  | "estadual"
  | "interestadual_proximo"
  | "interestadual_longo";

export type ShippingItem = {
  id: string;
  qty: number;
  weightKg?: number;
  price: number;
};

export type ShippingQuoteRequest = {
  destinationCep: string;
  items: ShippingItem[];
};

export type ShippingOption = {
  service: "Normal" | "Expresso";
  price: number;
  deadlineDays: { min: number; max: number };
  free: boolean;
};

export type ShippingQuoteResponse = {
  origin: { cep: string; label: string };
  destination: { cep: string; label: string };
  items: ShippingItem[];
  totalItemsWeightKg: number;
  subtotal: number;
  options: ShippingOption[];
  zone: Zone;
};
