"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOKEN_COOKIE, USER_COOKIE } from "@/lib/auth";

export async function logout() {
  const jar = await cookies();
  jar.delete(TOKEN_COOKIE);
  jar.delete(USER_COOKIE);
  redirect("/login");
}
