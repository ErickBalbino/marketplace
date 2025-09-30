"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

type AuthStatus = { authenticated: boolean; user: AuthUser | null };

export function useAuth() {
  const mounted = useRef(true);
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setAuth] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/status", { cache: "no-store" });
      if (!res.ok) throw new Error("auth status failed");
      const json = (await res.json()) as AuthStatus;
      if (!mounted.current) return;
      setAuth(json.authenticated);
      setUser(json.user);
    } catch {
      if (!mounted.current) return;
      setAuth(false);
      setUser(null);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    fetchStatus();

    const onFocus = () => fetchStatus();
    const onStorage = () => fetchStatus();

    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => {
      mounted.current = false;
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, [fetchStatus]);

  return { isAuthenticated, isLoading, user, refresh: fetchStatus };
}
