"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User } from "@/lib/types";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API Gateway base
const API_BASE = "http://localhost:5000";

// localStorage key
const TOKEN_KEY = "ez_token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (!token) localStorage.removeItem(TOKEN_KEY);
  else localStorage.setItem(TOKEN_KEY, token);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load profile using Bearer token
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();
        if (!token) {
          setUser(null);
          return;
        }

        const res = await fetch(`${API_BASE}/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) {
          // token invalid/expired
          setUser(null);
          setToken(null);
          return;
        }

        const data = await res.json();

        // user-service returns req.user directly; some gateways wrap as { user }
        const resolvedUser: User | null = data?.user ?? data ?? null;
        setUser(resolvedUser);
      } catch (err) {
        console.error("Session check failed:", err);
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login: AuthContextType["login"] = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          success: false,
          error: data?.message || "Invalid credentials",
        };
      }

      // Expect: { token, user }
      if (data?.token) setToken(String(data.token));
      setUser(data?.user ?? null);

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: "Unable to reach server" };
    }
  };

  const register: AuthContextType["register"] = async (
    email,
    password,
    name
  ) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          success: false,
          error: data?.message || "Registration failed",
        };
      }

      if (data?.token) setToken(String(data.token));
      setUser(data?.user ?? null);

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: "Unable to reach server" };
    }
  };

  const logout: AuthContextType["logout"] = async () => {
    setUser(null);
    setToken(null);

    // optional: if gateway exposes /auth/logout, call it; ignore failures
    try {
      await fetch(`${API_BASE}/auth/logout`, { method: "POST" });
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
