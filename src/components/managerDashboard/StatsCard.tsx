"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { statCards, type StatCardData } from "@/lib/mock/dashboard";
import { statIconMap, statColorClasses } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

function TrendBadge({ trend }: { trend: StatCardData["trend"] }) {
  const isUp = trend.direction === "up";
  const isDown = trend.direction === "down";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isUp && "bg-emerald-50 text-emerald-600",
        isDown && "bg-rose-50 text-rose-600",
        !isUp && !isDown && "bg-slate-100 text-slate-500"
      )}
    >
      {isUp && <ArrowUpRight className="h-3 w-3" />}
      {isDown && <ArrowDownRight className="h-3 w-3" />}
      {!isUp && !isDown && <Minus className="h-3 w-3" />}
      {trend.value}
    </span>
  );
}

function StatCard({ stat, index }: { stat: StatCardData; index: number }) {
  const Icon = statIconMap[stat.icon];
  const colors = statColorClasses[stat.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="transition-all duration-300"
    >
      <Card className="rounded-xl border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                colors.bg
              )}
            >
              <Icon className={cn("h-5 w-5", colors.text)} />
            </div>
            <TrendBadge trend={stat.trend} />
          </div>

          <p className="mt-4 text-sm font-medium text-slate-500">{stat.title}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {stat.value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{stat.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat: StatCardData, index: number) => (
        <StatCard key={stat.id} stat={stat} index={index} />
      ))}
    </div>
  );
}
