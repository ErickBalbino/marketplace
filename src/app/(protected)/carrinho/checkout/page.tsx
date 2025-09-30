"use client";

import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { CheckoutStepper } from "@/components/cart/CheckoutStepper";
import { brl } from "@/utils/formatCurrency";
import { useCheckout } from "@/contexts/CheckoutContext";
import { useCart } from "@/contexts/CartContext";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Barcode,
  QrCode,
  LucideProps,
} from "lucide-react";

type Method = "card" | "boleto" | "pix";

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}

function PaymentMethod({
  method,
  isOpen,
  onToggle,
  icon: Icon,
  title,
  children,
}: {
  method: Method;
  isOpen: boolean;
  onToggle: (method: Method) => void;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-slate-400 rounded-xl overflow-hidden mb-4 last:mb-0">
      <button
        onClick={() => onToggle(method)}
        className="w-full flex items-center justify-between p-4 bg-brand-100 hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-brand-600" />
          <span className="font-semibold text-slate-800">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          {children}
        </div>
      )}
    </div>
  );
}

function PixPayment({ total }: { total: number }) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isQrGenerated, setIsQrGenerated] = useState(false);

  useEffect(() => {
    if (total > 0 && qrRef.current && !isQrGenerated) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        `00020126580014BR.GOV.BCB.PIX013688993799441520400005303986540${total.toFixed(2)}5802BR5919Erick Balbino da Silva6008Sao Paulo62140510Pedido${Math.random().toString(36).substring(7)}6304`,
      )}`;

      const img = document.createElement("img");
      img.src = qrUrl;
      img.alt = "QR Code PIX";
      img.className = "w-full h-auto max-w-[200px] mx-auto";
      qrRef.current.innerHTML = "";
      qrRef.current.appendChild(img);
      setIsQrGenerated(true);
    }
  }, [total, isQrGenerated]);

  const pixPayload = `00020126580014BR.GOV.BCB.PIX013688993799441520400005303986540${total.toFixed(2)}5802BR5919Erick Balbino da Silva6008Sao Paulo62140510Pedido${Math.random().toString(36).substring(7)}6304`;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div className="text-center">
          <div ref={qrRef} className="flex justify-center mb-4">
            {/* QR Code será inserido aqui */}
            <div className="w-[200px] h-[200px] bg-slate-200 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-slate-500 text-sm">Gerando QR Code...</span>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Escaneie com seu app bancário
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Valor:</span>
              <span className="font-semibold">{brl(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Recebedor:</span>
              <span>Erick Balbino</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Chave PIX:</span>
              <span className="font-mono">88993799441</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigator.clipboard?.writeText(pixPayload)}
          className="w-full bg-slate-800 text-white rounded-lg py-3 px-4 font-semibold hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <QrCode size={18} />
          Copiar código PIX
        </button>
      </div>
    </div>
  );
}

function CardPayment() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Número do cartão
          </label>
          <input
            className="w-full rounded-lg border border-slate-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="0000 0000 0000 0000"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Validade
          </label>
          <input
            className="w-full rounded-lg border border-slate-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="MM/AA"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            CVV
          </label>
          <input
            className="w-full rounded-lg border border-slate-400 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="123"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Nome no cartão
          </label>
          <input
            className="w-full rounded-lg border border-slate-400 bg-white px-4 py-3 text-sm uppercase outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="NOME COMPLETO"
          />
        </div>
      </div>

      <button className="w-full bg-accent-600 text-white rounded-lg py-4 px-6 font-semibold hover:bg-accent-700 transition-colors shadow-sm text-sm">
        Efetuar pagamento
      </button>
    </div>
  );
}

function BoletoPayment({ total }: { total: number }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 rounded-lg p-6 text-center border border-slate-200">
        <Barcode size={48} className="mx-auto text-slate-400 mb-4" />
        <h4 className="font-semibold text-slate-800 mb-2">Boleto Bancário</h4>
        <p className="text-sm text-slate-600 mb-4">
          Pague em qualquer banco ou lotérica até a data de vencimento
        </p>
        <div className="text-lg font-bold text-slate-900">{brl(total)}</div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h5 className="font-semibold text-yellow-800 text-sm mb-2">
          Instruções:
        </h5>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
          <li>O boleto será gerado após a confirmação</li>
          <li>Vencimento em 3 dias úteis</li>
          <li>Pagamento em qualquer banco ou lotérica</li>
        </ul>
      </div>

      <button className="w-full bg-slate-800 text-white rounded-lg py-4 px-6 font-semibold hover:bg-slate-900 transition-colors text-sm">
        Gerar Boleto
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  const [openMethod, setOpenMethod] = useState<Method>("pix");
  const { freight } = useCheckout();
  const { cart } = useCart();

  const subtotal = cart.total;
  const freightPrice = freight?.price || 0;
  const total = subtotal + freightPrice;

  const handleMethodToggle = (method: Method) => {
    setOpenMethod(openMethod === method ? "pix" : method);
  };

  return (
    <>
      <CheckoutStepper current="checkout" />
      <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* Coluna principal - Métodos de pagamento */}
        <div className="space-y-6">
          <Section>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Finalizar pedido
            </h1>
            <p className="text-slate-600">Escolha como deseja pagar</p>

            <div className="mt-6 space-y-4">
              <PaymentMethod
                method="pix"
                isOpen={openMethod === "pix"}
                onToggle={handleMethodToggle}
                icon={QrCode}
                title="PIX"
              >
                <PixPayment total={total} />
              </PaymentMethod>

              <PaymentMethod
                method="card"
                isOpen={openMethod === "card"}
                onToggle={handleMethodToggle}
                icon={CreditCard}
                title="Cartão de crédito"
              >
                <CardPayment />
              </PaymentMethod>

              <PaymentMethod
                method="boleto"
                isOpen={openMethod === "boleto"}
                onToggle={handleMethodToggle}
                icon={Barcode}
                title="Boleto bancário"
              >
                <BoletoPayment total={total} />
              </PaymentMethod>
            </div>
          </Section>
        </div>

        {/* Coluna lateral - Resumo */}
        <aside className="lg:sticky lg:top-8 lg:h-fit space-y-6">
          <Section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Resumo do pedido
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold text-slate-900">
                  {brl(subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">Frete</span>
                <span className="font-semibold text-slate-900">
                  {brl(freightPrice)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900">
                    Total
                  </span>
                  <span className="text-lg font-bold text-brand-600">
                    {brl(total)}
                  </span>
                </div>
              </div>
            </div>
          </Section>

          {/* Informações de segurança */}
          <Section>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">
                  Pagamento seguro
                </h4>
                <p className="text-sm text-slate-600">
                  Seus dados estão protegidos com criptografia
                </p>
              </div>
            </div>
          </Section>
        </aside>
      </div>
    </>
  );
}
