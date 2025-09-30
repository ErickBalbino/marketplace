import Image from "next/image";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";
import { ProductGallery } from "../_components/ProductGallery";
import { BuyBox } from "../_components/BuyBox";
import { Reviews } from "../_components/Reviews";
import { Product } from "@/types/product";
import { cookies } from "next/headers";
import { ShipContainer } from "../_components/ShipContainer";
import { Metadata } from "next";
import { brl } from "@/utils/formatCurrency";
import { reviews } from "@/data/reviews";
import { RatingStars } from "../_components/RatingStars";
import { resolveImageSrc } from "@/lib/images";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams?.id;

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
    const productImage = resolveImageSrc(product.imageUrl || "");
    const productPrice = brl(product.price);

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
  searchParams: Promise<{ id?: string }>;
}) {
  const jar = await cookies();
  const shipToRaw = jar.get("ship_to")?.value ?? "";
  let shipTo: null | { cep: string; label?: string } = null;

  try {
    shipTo = shipToRaw ? JSON.parse(shipToRaw) : null;
  } catch {}

  const resolvedSearchParams = await searchParams;
  const id = resolvedSearchParams?.id;
  if (!id) return notFound();

  const res = await api(`/products/${encodeURIComponent(id)}`);
  if (!res.ok) return notFound();
  const data: Product = await res.json();

  const product = {
    ...data,
    imageUrl: resolveImageSrc(data.imageUrl || ""),
    quantity: 32,
    reviews: reviews,
  };

  const price = brl(product.price);

  const totalReviews = reviews.length;
  const avgReviews =
    totalReviews > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews
      : 0;

  return (
    <div className="container py-10">
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <section className="lg:h-[600px] flex justify-center lg:justify-start">
          <ProductGallery cover={product.imageUrl} />
        </section>

        <section
          aria-labelledby="descricao"
          className="min-w-0 w-full px-4 lg:px-0"
        >
          <div className="flex items-center gap-4 mb-4">
            <h3 className="font-medium text-sm text-slate-500">
              Vendido e entregue por
            </h3>
            <Image src="/logo.png" alt="" width={75} height={38} />
          </div>

          <h1
            id="descricao"
            className="text-2xl font-semibold tracking-tight mb-1"
          >
            {product.name}
          </h1>

          <div>
            <RatingStars value={avgReviews} size={16} />
          </div>

          <p className="mt-2 text-slate-700 leading-relaxed">
            {product.description}
          </p>

          <div className="flex w-full">
            <BuyBox
              priceLabel={price}
              productName={product.name || ""}
              productId={product.id}
              productPrice={product.price}
              productImage={product.imageUrl}
            />
          </div>

          <ShipContainer
            shipTo={shipTo}
            item={{ id: product.id, price: product.price, weightKg: 1.2 }}
          />
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] mt-10"></div>

      <div className="mt-10" id="reviews">
        <Reviews reviews={product.reviews} />
      </div>
    </div>
  );
}
