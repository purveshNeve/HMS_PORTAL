"use client";

import { Search, Bell, Sun, Moon, Plus, Menu } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileNav } from "./MobileNav";
import { avatar } from "@/lib/mock-data";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Recruitment Dashboard", subtitle: "Executive overview of hiring performance" },
  "/roles": { title: "Update Roles", subtitle: "Create, publish and manage open positions" },
  "/applications": { title: "Applications", subtitle: "Track candidates through the hiring pipeline" },
  "/offerings": { title: "Offerings", subtitle: "Manage and negotiate candidate offers" },
};

export function Topbar({ onCreate, createLabel }: { onCreate?: () => void; createLabel?: string }) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = titles[pathname ?? "/dashboard"] ?? titles["/dashboard"];

  return (
    <>
      <header className="sticky top-0 z-20 flex flex-col gap-4 border-b border-ink-100 bg-surface-light/85 px-4 py-4 backdrop-blur-xl dark:border-ink-700 dark:bg-surface-dark/85 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg border border-ink-100 p-2 text-ink-500 lg:hidden dark:border-ink-700"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50 sm:text-2xl">
                {meta.title}
              </h1>
              <p className="hidden text-sm text-ink-400 sm:block">{meta.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                placeholder="Search candidates, roles, offers…"
                className="w-64 rounded-xl border border-ink-100 bg-white py-2.5 pl-9 pr-3 text-sm text-ink-700 placeholder:text-ink-400 focus:border-evergreen-400 focus:outline-none dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-100 lg:w-80"
              />
            </div>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-xl border border-ink-100 p-2.5 text-ink-500 transition-colors hover:bg-ink-50 dark:border-ink-700 dark:text-ink-300 dark:hover:bg-ink-800"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              aria-label="Notifications"
              className="relative rounded-xl border border-ink-100 p-2.5 text-ink-500 transition-colors hover:bg-ink-50 dark:border-ink-700 dark:text-ink-300 dark:hover:bg-ink-800"
            >
              <Bell size={17} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-coral-500" />
            </button>

            {onCreate && (
              <button onClick={onCreate} className="btn-primary hidden sm:inline-flex">
                <Plus size={16} />
                {createLabel ?? "Create"}
              </button>
            )}

            <img
              src={avatar("admin-hr")}
              alt="Admin"
              className="h-9 w-9 rounded-full border-2 border-white object-cover shadow-soft dark:border-ink-700"
            />
          </div>
        </div>

        {onCreate && (
          <button onClick={onCreate} className="btn-primary w-full sm:hidden">
            <Plus size={16} />
            {createLabel ?? "Create"}
          </button>
        )}
      </header>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
