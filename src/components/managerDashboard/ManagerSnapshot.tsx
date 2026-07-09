"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { managerSnapshot, type SnapshotMetric } from "@/lib/mock/dashboard";

function MiniCircularStat({
  label,
  value,
  colorClass,
  index,
}: {
  label: string;
  value: number;
  colorClass: string;
  index: number;
}) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
          <circle cx="40" cy="40" r={radius} strokeWidth="7" className="stroke-slate-100" fill="none" />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
            className={colorClass}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut", delay: index * 0.08 }}
          />
        </svg>
        <span className="absolute text-sm font-semibold text-slate-800">{value}%</span>
      </div>
      <p className="max-w-[90px] text-center text-xs text-slate-500">{label}</p>
    </div>
  );
}

export function ManagerSnapshot() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800">
            Manager Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-between gap-4">
          {managerSnapshot.map((metric: SnapshotMetric, index: number) => (
            <MiniCircularStat
              key={metric.id}
              label={metric.label}
              value={metric.value}
              colorClass={metric.colorClass}
              index={index}
            />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
