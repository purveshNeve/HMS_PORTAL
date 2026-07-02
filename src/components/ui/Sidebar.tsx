"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileSignature,
  ChevronLeft,
  Building2,
  Settings,
  LifeBuoy,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, description: "Hiring overview" },
  { href: "/roles", label: "Update Roles", icon: Briefcase, description: "Manage open positions" },
  { href: "/applications", label: "Applications", icon: Users, description: "Candidate pipeline" },
  { href: "/offerings", label: "Offerings", icon: FileSignature, description: "Offer management" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 84 : 268 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-ink-100 bg-white/80 backdrop-blur-xl dark:border-ink-700 dark:bg-surface-dark/90 lg:flex"
    >
      <div className="flex h-16 items-center gap-3 border-b border-ink-100 px-5 dark:border-ink-700">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-evergreen-800 text-gold-300 dark:bg-evergreen-600">
          <Building2 size={18} strokeWidth={2.2} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="truncate font-display text-[15px] font-semibold leading-tight text-ink-900 dark:text-ink-50">
              Meridian HRMS
            </p>
            <p className="truncate text-[11px] font-medium uppercase tracking-wide text-ink-400">
              Recruitment
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navItems.map((item) => {
          const active = pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-evergreen-800 text-white shadow-soft dark:bg-evergreen-700"
                  : "text-ink-500 hover:bg-ink-50 hover:text-ink-800 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-ink-50"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-xl bg-evergreen-800 dark:bg-evergreen-700"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  style={{ zIndex: -1 }}
                />
              )}
              <Icon size={18} strokeWidth={2} className="shrink-0" />
              {!collapsed && (
                <div className="min-w-0">
                  <p className="truncate leading-tight">{item.label}</p>
                  <p
                    className={cn(
                      "truncate text-[11px] font-normal leading-tight",
                      active ? "text-evergreen-100/80" : "text-ink-400"
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-ink-100 px-3 py-4 dark:border-ink-700">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-800 dark:text-ink-300 dark:hover:bg-ink-800">
          <Settings size={18} />
          {!collapsed && <span>Settings</span>}
        </button>
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-50 hover:text-ink-800 dark:text-ink-300 dark:hover:bg-ink-800">
          <LifeBuoy size={18} />
          {!collapsed && <span>Support</span>}
        </button>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-ink-100 py-2 text-xs font-medium text-ink-400 transition-colors hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800"
        >
          <ChevronLeft size={14} className={cn("transition-transform", collapsed && "rotate-180")} />
          {!collapsed && "Collapse"}
        </button>
      </div>
    </motion.aside>
  );
}
