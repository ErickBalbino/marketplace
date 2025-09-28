import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Coordenadas ausentes" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(
        lat,
      )}&lon=${encodeURIComponent(lon)}&format=json&addressdetails=1`,
      {
        headers: {
          "User-Agent": "marketplace-app/1.0 (reverse-geocode)",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Falha ao geocodificar" },
        { status: 502 },
      );
    }

    const data = await response.json();
    const address = data?.address || {};

    const logradouro = address.road || address.pedestrian || "";
    const numero = address.house_number || "";
    const logradouroCompleto = [logradouro, numero].filter(Boolean).join(", ");

    const bairro = address.suburb || address.neighbourhood || "";
    const localidade = address.city || address.town || address.village || "";
    const uf = address.state || "";
    const cep = address.postcode
      ? String(address.postcode).replace(/\D/g, "").slice(0, 8)
      : "";

    return NextResponse.json({
      cep,
      logradouro: logradouroCompleto,
      bairro,
      localidade,
      uf,
    });
  } catch (error) {
    console.error("Geocode API Error:", error);
    return NextResponse.json(
      { error: "Serviço de geocode indisponível" },
      { status: 503 },
    );
  }
}
