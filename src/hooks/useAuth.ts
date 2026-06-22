"use client";
import { useSession } from "next-auth/react";
import type { UserRole } from "@/types";
import {Employee} from "@/types";
export function useAuth() {
  const { data: session, status, update } = useSession();
  const role: UserRole | undefined = session?.user?.role;
  const userId: string | undefined = session?.user?.userId;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  return {
    session,
    user: session?.user ?? null,
    role,
    userId,
    isLoading,
    isAuthenticated,
    isAdmin: role === "admin",
    isManager: role === "manager",
    isEmployee: role === "employee",
    updateSession: update,
  };
}
