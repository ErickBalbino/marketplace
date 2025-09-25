"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signOut() {
  const jar = await cookies();
  jar.delete("auth_token");
  jar.delete("auth_user");
  redirect("/login");
}
