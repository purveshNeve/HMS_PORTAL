"use client";

import { recruiterPerformance, avatar } from "@/lib/mock-data";
import { Star } from "lucide-react";

export function RecruiterPerformanceTable() {
  const sorted = [...recruiterPerformance].sort((a, b) => b.hires - a.hires);
  return (
    <div className="divide-y divide-ink-100 dark:divide-ink-700">
      {sorted.map((r, i) => (
        <div key={r.recruiter} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <span className="w-5 text-center font-mono text-xs text-ink-300">{i + 1}</span>
          <img src={avatar(r.recruiter)} alt={r.recruiter} className="h-9 w-9 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink-800 dark:text-ink-100">{r.recruiter}</p>
            <p className="text-xs text-ink-400">{r.hires} hires · avg {r.avgDays}d</p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-gold-600 dark:text-gold-400">
            <Star size={12} className="fill-current" />
            {r.satisfaction}
          </div>
        </div>
      ))}
    </div>
  );
}
