import { NextRequest, NextResponse } from "next/server";
import { adminListProducts } from "@/app/(admin)/services/products";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 12);
  const q = searchParams.get("q") ?? undefined;

  try {
    const data = await adminListProducts({ page, limit, q });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Erro ao listar" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const image = formData.get("image") as File;

    if (!name || !description || !price || !image) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 },
      );
    }

    const token = (await cookies()).get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const apiFormData = new FormData();
    apiFormData.append("name", name);
    apiFormData.append("description", description);
    apiFormData.append("price", price);
    apiFormData.append("image", image);

    const apiResponse = await fetch(
      `${process.env.API_BASE_URL || "http://localhost:3001"}/products`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: apiFormData,
      },
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("Backend API Error:", apiResponse.status, errorText);

      return NextResponse.json(
        { error: `Erro no backend: ${errorText}` },
        { status: apiResponse.status },
      );
    }

    const product = await apiResponse.json();
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
