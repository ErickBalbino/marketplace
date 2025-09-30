import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:3001";

async function buildAuthHeaders(): Promise<HeadersInit> {
  const jar = await cookies();
  const token = jar.get("auth_token")?.value ?? "";
  const h: Record<string, string> = { Accept: "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

type Params = { id: string };

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { id } = await params;
  const fd = await req.formData();

  const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: fd,
    headers: await buildAuthHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    const payload = await res.text().catch(() => "");
    return NextResponse.json(
      { message: "Erro ao atualizar", detail: payload || undefined },
      { status: res.status },
    );
  }

  const json = await res.json();
  return NextResponse.json(json);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<Params> },
) {
  const { id } = await params;

  const res = await fetch(`${API_BASE}/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: await buildAuthHeaders(),
    cache: "no-store",
  });

  if (!res.ok) {
    const payload = await res.text().catch(() => "");
    return NextResponse.json(
      { message: "Erro ao deletar", detail: payload || undefined },
      { status: res.status },
    );
  }

  const json = await res.json();
  return NextResponse.json(json);
}
