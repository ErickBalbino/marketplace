"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AuthUser } from "@/types/Auth";

const API = process.env.API_BASE_URL ?? "http://localhost:3001";

type State = { error?: string };

export async function registerAction(
  _prev: State | undefined,
  formData: FormData,
): Promise<State> {
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const phone = String(formData.get("phone") || "").replace(/\D+/g, "");
  const cpf = String(formData.get("cpf") || "").replace(/\D+/g, "");

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone, cpf }),
    cache: "no-store",
  });

  console.log(res);

  if (res.status === 409)
    return {
      error:
        "Os dados informados estão vinculados a uma conta existente, realize o login",
    };
  if (!res.ok) {
    let msg = "Falha ao criar conta. Tente novamente.";
    try {
      const j = await res.json();
      if (typeof j?.message === "string") msg = j.message;
    } catch {}
    return { error: msg };
  }

  let data: {
    user: AuthUser;
    accessToken: string;
  } | null = null;
  try {
    data = await res.json();
  } catch {}

  const token = data?.accessToken;
  const user = data?.user;

  if (token && user) {
    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    (await cookies()).set("auth_user", JSON.stringify(user), {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    redirect("/");
  }

  redirect("/login?registered=1");
}
