"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API = process.env.API_BASE_URL ?? "http://localhost:3001";

export async function authenticate(
  _prev: { error?: string } | undefined,
  formData: FormData,
) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    await res.json().catch(() => ({}));
    return { error: "Email e/ou senha são invalidos, tente novamente!" };
  }

  const data = await res.json();
  const token = data?.access_token || data?.token;
  if (!token) return { error: "Token não recebido." };
  (await cookies()).set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/");
}
