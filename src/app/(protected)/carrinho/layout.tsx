import { CheckoutProvider } from "@/contexts/CheckoutContext";
import type { ReactNode } from "react";

export default function CartFlowLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container py-6">
      <CheckoutProvider>
        <div className="mx-auto max-w-5xl">{children}</div>
      </CheckoutProvider>
    </div>
  );
}
