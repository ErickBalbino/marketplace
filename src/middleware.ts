import { NextResponse, type NextRequest } from "next/server";
import { AUTH_ROUTES, PROTECTED_PREFIXES } from "@/lib/routes";

function startsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const hasToken = Boolean(req.cookies.get("auth_token")?.value);

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
