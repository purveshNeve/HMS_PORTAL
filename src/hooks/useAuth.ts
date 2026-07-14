"use client";
import { useSession } from "next-auth/react";
import type { UserRole } from "@/types";
import {Employee} from "@/types";
export function useAuth() {
  const { data: session, status, update } = useSession();
  const role: UserRole | undefined = session?.user?.role;
  const userId: string | undefined = session?.user?.userId || session?.user?.id;
  const department: string | undefined = session?.user?.department;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const normalizedRole = role?.toLowerCase() as UserRole | undefined;

  return {
    session,
    user: session?.user ?? null,
    role,
    userId,
    department,
    isLoading,
    isAuthenticated,
    isAdmin: normalizedRole === "admin",
    isManager: normalizedRole === "manager",
    isEmployee: normalizedRole === "employee",
    updateSession: update,
  };
}
