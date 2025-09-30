export function brl(n: number) {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(n);
  } catch {
    return `R$ ${Number(n || 0).toFixed(2)}`;
  }
}
