// components/dashboard/StatsCard.tsx
"use client";

import { motion, useSpring } from "framer-motion";
import {
  Users, UserCheck, Building2, UserCog, Briefcase, FileText, CalendarOff, Wallet,
  TrendingUp, TrendingDown, Minus, LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatStatValue } from "@/lib/format";
import type { StatCardData } from "@/types/admindashboard";

const ICONS: Record<string, LucideIcon> = {
  Users, UserCheck, Building2, UserCog, Briefcase, FileText, CalendarOff, Wallet,
};

const ACCENTS: Record<StatCardData["accent"], { bg: string; text: string }> = {
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
  sky: { bg: "bg-sky-50", text: "text-sky-600" },
  rose: { bg: "bg-rose-50", text: "text-rose-600" },
  violet: { bg: "bg-violet-50", text: "text-violet-600" },
  teal: { bg: "bg-teal-50", text: "text-teal-600" },
  slate: { bg: "bg-slate-100", text: "text-slate-600" },
};

function AnimatedNumber({ value, format }: { value: number; format?: StatCardData["format"] }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 90, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => setDisplay(Math.round(v)));
    return () => unsub();
  }, [spring]);

  return <>{formatStatValue(display, format)}</>;
}

export function StatsCard({ stat, index }: { stat: StatCardData; index: number }) {
  const Icon = ICONS[stat.icon] ?? Users;
  const accent = ACCENTS[stat.accent];
  const TrendIcon = stat.trend === "up" ? TrendingUp : stat.trend === "down" ? TrendingDown : Minus;
  const trendColor =
    stat.trend === "up" ? "text-emerald-600" : stat.trend === "down" ? "text-rose-500" : "text-gray-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -3 }}
      className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent.bg}`}>
          <Icon className={`h-[18px] w-[18px] ${accent.text}`} />
        </span>
        {stat.trend && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="h-3 w-3" />
          </span>
        )}
      </div>

      <p className="mt-3 text-xs font-medium text-gray-500">{stat.label}</p>
      <p className="mt-0.5 text-2xl font-semibold tracking-tight text-gray-900">
        <AnimatedNumber value={stat.value} format={stat.format} />
      </p>
      {stat.deltaLabel && <p className={`mt-1 text-xs ${trendColor}`}>{stat.deltaLabel}</p>}
    </motion.div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-100" />
      <div className="mt-3 h-3 w-20 animate-pulse rounded bg-gray-100" />
      <div className="mt-2 h-6 w-16 animate-pulse rounded bg-gray-100" />
      <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-100" />
    </div>
  );
}
