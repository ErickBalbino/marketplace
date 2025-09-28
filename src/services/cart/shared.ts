import { resolveImageSrc } from "@/lib/images";
import type { Cart, CartProduct } from "@/types/cart";

type NewItem = {
  product?: {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    price: number;
  };
  quantity?: number;
  itemTotal?: number;
};
type NewCart = { items?: NewItem[]; totalItems?: number; totalPrice?: number };

type OldItem = {
  id: string;
  name: string;
  imageUrl?: string;
  price?: number;
  quantity?: number;
};
type OldCart = { items?: OldItem[]; total?: number };

export function mapCartResponse(json: unknown): Cart {
  const asNew = json as NewCart;
  const asOld = json as OldCart;

  let items: CartProduct[] = [];

  if (
    Array.isArray(asNew.items) &&
    asNew.items.length &&
    "product" in asNew.items[0]!
  ) {
    items = asNew.items!.map((it) => ({
      id: String(it.product?.id ?? ""),
      name: String(it.product?.name ?? ""),
      price: Number(it.product?.price ?? 0),
      imageUrl: resolveImageSrc(it.product?.imageUrl),
      quantity: Number(it.quantity ?? 0),
    }));
  } else if (Array.isArray(asOld.items)) {
    items = asOld.items.map((p) => ({
      id: String(p.id ?? ""),
      name: String(p.name ?? ""),
      price: Number(p.price ?? 0),
      imageUrl: resolveImageSrc(p.imageUrl),
      quantity: Number(p.quantity ?? 0),
    }));
  }

  const total =
    typeof asNew.totalPrice === "number"
      ? asNew.totalPrice
      : typeof asOld.total === "number"
        ? asOld.total
        : items.reduce((s, i) => s + i.price * i.quantity, 0);

  return { items, total };
}

export function computeTotal(items: CartProduct[]): number {
  return items.reduce((s, i) => s + i.price * i.quantity, 0);
}
