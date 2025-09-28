import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawCep = (searchParams.get("cep") || "").replace(/\D/g, "");

  if (rawCep.length !== 8) {
    return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Falha ao consultar CEP" },
        { status: 502 },
      );
    }

    const data = await response.json();

    if (data?.erro) {
      return NextResponse.json(
        { error: "CEP não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      cep: String(data.cep || rawCep).replace(/\D/g, ""),
      logradouro: data.logradouro || "",
      bairro: data.bairro || "",
      localidade: data.localidade || "",
      uf: data.uf || "",
    });
  } catch (error) {
    console.error("CEP API Error:", error);
    return NextResponse.json(
      { error: "Serviço de CEP indisponível" },
      { status: 503 },
    );
  }
}
