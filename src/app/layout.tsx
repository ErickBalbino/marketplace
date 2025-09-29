import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { CartProvider } from "@/contexts/CartContext";
import ProgressLoader from "@/components/ProgressLoader";
import { Toaster } from "sonner";
import { getServerCart } from "@/services/cart/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Marketplace em Next.js + TypeScript",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialCart = await getServerCart();

  return (
    <html suppressHydrationWarning lang="pt-BR">
      <body className={`${inter.variable} ${jetbrains.variable} min-h-dvh`}>
        <ProgressLoader />
        <Toaster position="top-right" richColors duration={1500} />
        <CartProvider initialCart={initialCart}>{children}</CartProvider>
      </body>
    </html>
  );
}
