"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  delta: number;
  trend: "up" | "down";
  goodDirection?: "up" | "down";
  icon: LucideIcon;
  index?: number;
}

export function KpiCard({ label, value, delta, trend, goodDirection = "up", icon: Icon, index = 0 }: KpiCardProps) {
  const isGood = trend === goodDirection;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="card-surface group relative overflow-hidden p-5 transition-shadow hover:shadow-lift"
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-evergreen-50 opacity-0 transition-opacity group-hover:opacity-60 dark:bg-evergreen-900/30" />
      <div className="relative flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-evergreen-50 text-evergreen-700 dark:bg-evergreen-900/40 dark:text-evergreen-300">
          <Icon size={18} strokeWidth={2} />
        </div>
        <div
          className={cn(
            "flex items-center gap-0.5 rounded-full px-2 py-1 text-[11px] font-semibold",
            isGood
              ? "bg-evergreen-50 text-evergreen-700 dark:bg-evergreen-900/40 dark:text-evergreen-300"
              : "bg-coral-50 text-coral-600 dark:bg-coral-900/30 dark:text-coral-300"
          )}
        >
          {trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(delta)}%
        </div>
      </div>
      <p className="relative mt-4 eyebrow">{label}</p>
      <p className="relative mt-1 stat-number">{value}</p>
    </motion.div>
  );
}

export function KpiCardSkeleton() {
  return (
    <div className="card-surface p-5">
      <div className="skeleton h-10 w-10 rounded-xl" />
      <div className="skeleton mt-4 h-3 w-20" />
      <div className="skeleton mt-2 h-8 w-24" />
    </div>
  );
}
