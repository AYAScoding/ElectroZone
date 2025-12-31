"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LS_USER_KEY = "ez_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_USER_KEY);
      if (saved) setUser(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const persistUser = (u: User | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem(LS_USER_KEY, JSON.stringify(u));
      else localStorage.removeItem(LS_USER_KEY);
    } catch {
      // ignore
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // TODO: Replace with real Auth Service call
      // For now keep a stable id to match Order Service "userId" usage. [file:2]
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      persistUser(mockUser);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // TODO: Replace with real Auth Service call
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      persistUser(mockUser);
      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    persistUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
