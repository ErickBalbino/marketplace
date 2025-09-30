import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin | AllMarket",
  description: "Painel de administração do AllMarket",
};

export default function AdminIndex() {
  redirect("/admin/produtos");
}
