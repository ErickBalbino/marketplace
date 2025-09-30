import type { AuthUser } from "@/types/auth";

export const TOKEN_COOKIE = "auth_token";
export const USER_COOKIE = "auth_user";

export function getClientAuthStatus(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const hasAuthIndicator =
      document.cookie.includes(TOKEN_COOKIE) ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token");

    return !!hasAuthIndicator;
  } catch {
    return false;
  }
}

export function getClientUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const raw =
      localStorage.getItem("auth_user") || sessionStorage.getItem("auth_user");
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}
