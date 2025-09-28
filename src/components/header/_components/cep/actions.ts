"use server";

import { cookies } from "next/headers";

export async function confirmShipTo(
  _prev: unknown,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const cep = String(formData.get("cep") || "").replace(/\D/g, "");
    const label = String(formData.get("label") || "").trim();

    if (!cep || cep.length !== 8) {
      return { ok: false, error: "CEP inválido." };
    }

    (await cookies()).set("ship_to", JSON.stringify({ cep, label }), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return { ok: true };
  } catch {
    return { ok: false, error: "Não foi possível salvar o CEP." };
  }
}
