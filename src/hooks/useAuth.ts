"use client";

import { useSession } from "next-auth/react";

import type { UserRole } from "@/types";

export function useAuth() {
  const { data: session, status, update } = useSession();

  const role: UserRole | undefined = session?.user?.role;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  return {
    session,
    user: session?.user ?? null,
    role,
    isLoading,
    isAuthenticated,
    isAdmin: role === "admin",
    isManager: role === "manager",
    isEmployee: role === "employee",
    updateSession: update,
  };
}
