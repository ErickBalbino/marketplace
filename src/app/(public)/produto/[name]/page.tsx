import Image from "next/image";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { ProductGallery } from "../_components/ProductGallery";
import { BuyBox } from "../_components/BuyBox";
import { Specifications } from "../_components/Specifications";
import { Reviews } from "../_components/Reviews";
import { Product } from "@/types/Product";
import { cookies } from "next/headers";
import { ShipContainer } from "../_components/ShipContainer";
import { Metadata } from "next";

function normalizeImageUrl(src: string) {
  if (!src) return "/next.svg";
  if (/^https?:\/\//i.test(src)) return src;
  const base = (process.env.API_BASE_URL ?? "http://localhost:3001").replace(
    /\/+$/,
    "",
  );
  const path = src.replace(/^\/+/, "");
  return `${base}/${path}`;
}

function currency(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v);
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { id?: string };
}): Promise<Metadata> {
  const id = searchParams?.id;

  if (!id) {
    return {
      title: "Produto Não Encontrado - Marketplace",
      description: "Produto não encontrado em nossa loja.",
    };
  }

  try {
    const res = await api(`/products/${encodeURIComponent(id)}`);

    if (!res.ok) {
      return {
        title: "Produto Não Encontrado - Marketplace",
        description: "Produto não encontrado em nossa loja.",
      };
    }

    const product: Product = await res.json();
    const productName = product.name || product.title || "Produto";
    const productDescription =
      product.description ||
      `Compre ${productName} no Marketplace com os melhores preços e entrega rápida.`;
    const productImage = normalizeImageUrl(product.imageUrl || "");
    const productPrice = currency(product.price);

    return {
      title: `${productName} | AllMarket`,
      description: productDescription,
      openGraph: {
        title: `${productName} - ${productPrice}`,
        description: productDescription,
        images: [
          {
            url: productImage,
            width: 800,
            height: 600,
            alt: productName,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${productName} - ${productPrice}`,
        description: productDescription,
        images: [productImage],
      },
      keywords: [
        productName,
        "marketplace",
        "comprar",
        "produto",
        ...(productName.split(" ") || []),
      ],
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Produto - Marketplace",
      description: "Descubra este produto incrível no Marketplace.",
    };
  }
}

export default async function ProductPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const jar = await cookies();
  const shipToRaw = jar.get("ship_to")?.value ?? "";
  let shipTo: null | { cep: string; label?: string } = null;

  try {
    shipTo = shipToRaw ? JSON.parse(shipToRaw) : null;
  } catch {}

  const id = searchParams?.id;
  if (!id) return notFound();

  const res = await api(`/products/${encodeURIComponent(id)}`);
  if (!res.ok) return notFound();
  const data: Product = await res.json();

  const product = {
    ...data,
    imageUrl: normalizeImageUrl(data.imageUrl || ""),
    quantity: 32,
    reviews: [
      {
        id: "r1",
        author: "Edinaldo",
        rating: 5,
        date: "2025-08-19",
        title: "Excelente",
        text: "Imagem ótima e sistema rápido. Muito satisfeito!",
        photo: "/review-1.jpg",
      },
      {
        id: "r2",
        author: "Jéssica",
        rating: 5,
        date: "2025-09-22",
        title: "Top, sensacional",
        text: "Vale muito a pena. Entrega rápida e produto perfeito.",
        photo: "/review-2.jpg",
      },
    ] as {
      id: string;
      author: string;
      rating: number;
      date: string;
      title: string;
      text: string;
      photo?: string;
    }[],
  };

  const price = currency(product.price);

  return (
    <div className="container py-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,560px)_1fr_360px]">
        <section aria-labelledby="galeria">
          <h2 id="galeria" className="sr-only">
            Imagens do produto
          </h2>
          <ProductGallery cover={product.imageUrl} />
        </section>

        <section aria-labelledby="descricao" className="min-w-0">
          <h1 id="descricao" className="text-2xl font-semibold tracking-tight">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
              {product.quantity > 0 ? "Em estoque" : "Indisponível"}
            </span>
          </div>

          <p className="mt-4 text-slate-700 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-6 rounded-xl border bg-slate-50 p-4 text-slate-700">
            <h3 className="mb-2 font-medium">Vendido e entregue por</h3>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
              <Image src="/logo.png" alt="" width={100} height={50} />
            </div>
          </div>
        </section>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <BuyBox priceLabel={price} productName={product.name || ""} />
        </aside>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Specifications />

        <ShipContainer
          shipTo={shipTo}
          item={{ id: product.id, price: product.price, weightKg: 1.2 }}
        />
      </div>

      <div className="mt-10">
        <Reviews reviews={product.reviews} />
      </div>
    </div>
  );
}
