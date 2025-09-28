export interface Product {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stockStatus?: "in" | "low" | "out";
}
