"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/components/navigation/Sidebar";

export interface NavbarProps {
  title?: string;
  items?: NavItem[];
  showAuthActions?: boolean;
  className?: string;
}

export function Navbar({
  title = "HRMS",
  items,
  showAuthActions = true,
  className,
}: NavbarProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };
  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between gap-6 border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-6">
        <Link
          href="/"
          className="shrink-0 text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          {title}
        </Link>
        {items && items.length > 0 && (
          <nav className="flex items-center gap-1 overflow-x-auto">
            {items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
      {showAuthActions && (
        <div className="flex shrink-0 items-center gap-3">
          {isLoading ? (
            <span className="text-sm text-zinc-500">Loading...</span>
          ) : isAuthenticated && user ? (
            <>
              <div className="text-right text-sm">
                <div className="font-medium text-zinc-900 dark:text-zinc-50">{user.name}</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">{user.userId}</div>
              </div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleSignOut}
              >
                Sign out
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign in</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
