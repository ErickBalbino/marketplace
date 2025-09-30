import "server-only";
import { cookies } from "next/headers";
import type { AuthUser } from "@/types/auth";

export const TOKEN_COOKIE = "auth_token";
export const USER_COOKIE = "auth_user";

export async function getToken() {
  const jar = await cookies();
  return jar.get(TOKEN_COOKIE)?.value ?? null;
}

export async function getSession() {
  const jar = await cookies();
  const token = jar.get(TOKEN_COOKIE)?.value ?? null;
  const raw = jar.get(USER_COOKIE)?.value ?? null;

  if (!token || !raw) return null;

  try {
    const user: AuthUser = JSON.parse(raw);
    return { token, user };
  } catch {
    return null;
  }
}
