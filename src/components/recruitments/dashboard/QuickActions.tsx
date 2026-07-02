"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FilePlus2, Users2, CalendarPlus, FileBarChart2 } from "lucide-react";

const actions = [
  { label: "Create New Role", desc: "Open a new position", icon: FilePlus2, href: "/roles" },
  { label: "View Applications", desc: "Review candidate pipeline", icon: Users2, href: "/applications" },
  { label: "Schedule Interview", desc: "Book upcoming rounds", icon: CalendarPlus, href: "/applications" },
  { label: "Generate Reports", desc: "Export PDF or Excel", icon: FileBarChart2, href: "#reports" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((a, i) => {
        const Icon = a.icon;
        return (
          <motion.div key={a.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Link
              href={a.href}
              className="group flex h-full flex-col justify-between rounded-xl border border-ink-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-evergreen-300 hover:shadow-card dark:border-ink-700 dark:bg-surface-darkcard"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-evergreen-50 text-evergreen-700 transition-colors group-hover:bg-evergreen-800 group-hover:text-white dark:bg-evergreen-900/40 dark:text-evergreen-300">
                <Icon size={16} />
              </div>
              <div className="mt-3">
                <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">{a.label}</p>
                <p className="text-[11px] text-ink-400">{a.desc}</p>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
