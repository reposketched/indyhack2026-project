"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateId, getInitials } from "@/lib/utils";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
}

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  initials: string;
  passwordHash: string;
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

function hashPassword(password: string): string {
  return btoa(password + "_complanion_2026");
}

function getAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("complanion_accounts") || "[]");
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredAccount[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("complanion_accounts", JSON.stringify(accounts));
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const accounts = getAccounts();
        const found = accounts.find(
          (a) => a.email.toLowerCase() === email.toLowerCase().trim()
        );
        if (!found) return { ok: false, error: "No account found with that email." };
        if (found.passwordHash !== hashPassword(password)) {
          return { ok: false, error: "Incorrect password." };
        }
        const user: AuthUser = {
          id: found.id,
          name: found.name,
          email: found.email,
          initials: found.initials,
        };
        set({ user, isAuthenticated: true });
        return { ok: true };
      },

      register: async (name, email, password) => {
        const accounts = getAccounts();
        if (accounts.find((a) => a.email.toLowerCase() === email.toLowerCase().trim())) {
          return { ok: false, error: "An account with this email already exists." };
        }
        const newAccount: StoredAccount = {
          id: generateId(),
          name: name.trim(),
          email: email.toLowerCase().trim(),
          initials: getInitials(name),
          passwordHash: hashPassword(password),
        };
        saveAccounts([...accounts, newAccount]);
        const user: AuthUser = {
          id: newAccount.id,
          name: newAccount.name,
          email: newAccount.email,
          initials: newAccount.initials,
        };
        set({ user, isAuthenticated: true });
        return { ok: true };
      },

      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "complanion_auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
