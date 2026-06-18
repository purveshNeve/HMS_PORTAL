"use client";

import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export interface NavbarProps {
  title?: string;
  className?: string;
}

export function Navbar({ title = "HRMS", className }: NavbarProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <Link href="/" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </Link>

      <div className="flex items-center gap-3">
        {isLoading ? (
          <span className="text-sm text-zinc-500">Loading...</span>
        ) : isAuthenticated && user ? (
          <>
            <span className="hidden text-sm text-zinc-600 dark:text-zinc-400 sm:inline">
              {user.name} · {user.role}
            </span>
            <Link href="/login">
              <Button variant="secondary" size="sm">
                Sign out
              </Button>
            </Link>
          </>
        ) : (
          <Link href="/login">
            <Button size="sm">Sign in</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
