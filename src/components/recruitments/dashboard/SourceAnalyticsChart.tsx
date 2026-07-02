"use client";

import { motion } from "framer-motion";
import { sourceAnalytics } from "@/lib/mock-data";

export function SourceAnalyticsChart() {
  const max = Math.max(...sourceAnalytics.map((s) => s.value));
  const total = sourceAnalytics.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-4">
      {sourceAnalytics.map((s, i) => (
        <div key={s.source}>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-ink-600 dark:text-ink-300">{s.source}</span>
            <span className="font-mono text-ink-400">
              {s.value.toLocaleString()} <span className="text-ink-300">· {Math.round((s.value / total) * 100)}%</span>
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-50 dark:bg-ink-800">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${(s.value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              className="h-full rounded-full"
              style={{ backgroundColor: s.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
