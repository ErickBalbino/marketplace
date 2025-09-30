import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_ROUTES,
  PROTECTED_PREFIXES,
  ADMIN_PREFIX,
  ADMIN_PUBLIC_ROUTES,
  ADMIN_DEFAULT_AFTER_LOGIN,
} from "@/lib/routes";

const TOKEN_COOKIE = "auth_token";
const USER_COOKIE = "auth_user";

function startsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

function parseRole(req: NextRequest): string | null {
  const raw = req.cookies.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    const user = JSON.parse(raw) as { role?: string };
    return user?.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const hasToken = Boolean(req.cookies.get(TOKEN_COOKIE)?.value);
  const role = parseRole(req);

  // 1) ADMIN MIDDLEWARE
  const isAdminRoute =
    pathname === ADMIN_PREFIX || pathname.startsWith(ADMIN_PREFIX + "/");
  const isAdminPublic = ADMIN_PUBLIC_ROUTES.includes(pathname);

  if (isAdminRoute) {
    if (isAdminPublic) {
      if (hasToken && role === "ADMIN") {
        const url = req.nextUrl.clone();
        url.pathname = ADMIN_DEFAULT_AFTER_LOGIN;
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }

    if (!hasToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }

    if (role !== "ADMIN") {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = `?err=not_admin`;
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // 2) USER MIDDLEWARE
  if (startsWithAny(pathname, PROTECTED_PREFIXES) && !hasToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (AUTH_ROUTES.includes(pathname) && hasToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|assets|.*\\.(?:png|jpg|jpeg|svg|webp|ico|css|js)).*)",
  ],
};
