"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOKEN_COOKIE, USER_COOKIE } from "@/lib/auth";

const API = process.env.API_BASE_URL ?? "http://localhost:3001";

export async function authenticateAdmin(
  _prev: { error?: string } | undefined,
  formData: FormData,
) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "");

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return {
      error:
        data?.message == "Invalid credentials"
          ? "Email e/ou senha são inválidos"
          : data?.message,
    };
  }

  const data = await res.json();
  const token = data?.accessToken;
  const user = data?.user;

  if (!token || !user) return { error: "Credenciais inválidas." };

  if (user.role !== "ADMIN") {
    return {
      error: "Acesso permitido apenas para administradores.",
    };
  }

  const jar = await cookies();
  jar.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  jar.set(USER_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const dest = next && next.startsWith("/") ? next : "/admin/produtos";

  redirect(dest);
}
