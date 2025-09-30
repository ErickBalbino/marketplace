import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

const TOKEN_COOKIE = "auth_token";
const USER_COOKIE = "auth_user";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(TOKEN_COOKIE)?.value ?? null;
  const rawUser = jar.get(USER_COOKIE)?.value ?? null;

  let user: AuthUser | null = null;
  if (rawUser) {
    try {
      user = JSON.parse(rawUser) as AuthUser;
    } catch {
      user = null;
    }
  }

  return NextResponse.json({
    authenticated: Boolean(token),
    user,
  });
}
