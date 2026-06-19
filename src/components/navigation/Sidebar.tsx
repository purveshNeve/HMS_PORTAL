"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const NAV_ITEMS_BY_ROLE: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Recruitments", href: "/admin/Recruitments" },
    { label: "Employees", href: "/admin/Employees" },
    { label: "Cultural", href: "/admin/Cultural" },
  ],
  manager: [
    { label: "Dashboard", href: "/manager/dashboard" },
    { label: "My Team", href: "/manager/team" },
    { label: "Approvals", href: "/manager/approvals" },
    { label: "Performance", href: "/manager/performance" },
    { label: "Time Off", href: "/manager/pto" },
  ],
  employee: [
    { label: "Dashboard", href: "/employee/dashboard" },
    { label: "Pay & Benefits", href: "/employee/payroll" },
    { label: "Time Off", href: "/employee/pto" },
    { label: "Goals", href: "/employee/goals" },
    { label: "Feedback", href: "/employee/feedback" },
  ],
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin Portal",
  manager: "Manager Portal",
  employee: "Employee Portal",
};

export interface SidebarProps {
  role?: UserRole;
  items?: NavItem[];
  title?: string;
  className?: string;
}

export function Sidebar({
  role = "employee",
  items,
  title,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const navItems = items ?? NAV_ITEMS_BY_ROLE[role];
  const portalTitle = title ?? ROLE_LABELS[role];

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          HRMS Portal
        </p>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{portalTitle}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
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
    </aside>
  );
}
