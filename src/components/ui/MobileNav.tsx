"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Briefcase, Users, FileSignature, X, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roles", label: "Update Roles", icon: Briefcase },
  { href: "/applications", label: "Applications", icon: Users },
  { href: "/offerings", label: "Offerings", icon: FileSignature },
];

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-lift dark:bg-surface-dark lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b border-ink-100 px-5 dark:border-ink-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-evergreen-800 text-gold-300">
                  <Building2 size={16} />
                </div>
                <span className="font-display text-[15px] font-semibold text-ink-900 dark:text-ink-50">
                  Meridian HRMS
                </span>
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-800">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-5">
              {navItems.map((item) => {
                const active = pathname?.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-evergreen-800 text-white"
                        : "text-ink-500 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800"
                    )}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
