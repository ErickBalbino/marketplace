const API = process.env.API_BASE_URL ?? "http://localhost:3001";

type Opts = Omit<RequestInit, "headers"> & { headers?: Record<string, string> };

export async function api(path: string, opts: Opts = {}) {
  const isServer = typeof window === "undefined";
  const base = API.replace(/\/+$/, "");
  const url = `${base}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };

  if (isServer) {
    const { cookies } = await import("next/headers");
    const token = (await cookies()).get("auth_token")?.value;

    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...opts, headers, cache: "no-store" });

  if (res.status === 401 && !isServer) {
    const next =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "/";
    window.location.href = `/login?next=${encodeURIComponent(next)}`;
    return Promise.reject(new Error("Unauthorized"));
  }

  return res;
}
