// components/dashboard/QuickActions.tsx
"use client";

import { motion } from "framer-motion";
import {
  UserPlus, Building2, Briefcase, CalendarCheck, Wallet, BarChart3, ShieldCheck, Megaphone, LucideIcon,
} from "lucide-react";
import { SectionCard, SectionHeading } from "./DashboardStates";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  gradient: string;
  href?: string;
}

const ACTIONS: QuickAction[] = [
  { label: "Add Employee", icon: UserPlus, gradient: "from-indigo-500 to-indigo-600" },
  { label: "Create Department", icon: Building2, gradient: "from-sky-500 to-sky-600" },
  { label: "Create Job Opening", icon: Briefcase, gradient: "from-amber-500 to-amber-600" },
  { label: "Approve Leave", icon: CalendarCheck, gradient: "from-emerald-500 to-emerald-600" },
  { label: "Run Payroll", icon: Wallet, gradient: "from-violet-500 to-violet-600" },
  { label: "View Reports", icon: BarChart3, gradient: "from-teal-500 to-teal-600" },
  { label: "Manage Roles", icon: ShieldCheck, gradient: "from-rose-500 to-rose-600" },
  { label: "Send Announcement", icon: Megaphone, gradient: "from-slate-600 to-slate-700" },
];

export function QuickActions({ onAction }: { onAction?: (label: string) => void }) {
  return (
    <SectionCard>
      <SectionHeading title="Quick Actions" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ACTIONS.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: i * 0.03 }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction?.(action.label)}
            className={`flex flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-br ${action.gradient} px-3 py-5 text-white shadow-sm transition-shadow hover:shadow-lg`}
          >
            <action.icon className="h-5 w-5" />
            <span className="text-center text-xs font-medium leading-tight">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </SectionCard>
  );
}
