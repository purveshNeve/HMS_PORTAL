"use client";

import { Sparkles, AlertTriangle, TrendingUp, Target } from "lucide-react";
import { motion } from "framer-motion";

const insights = [
  {
    icon: AlertTriangle,
    tone: "coral" as const,
    title: "Bottleneck detected",
    body: "Technical Round is holding 41 candidates 6.2 days longer than benchmark for Engineering roles.",
  },
  {
    icon: TrendingUp,
    tone: "gold" as const,
    title: "Demand forecast",
    body: "Sales headcount demand projected to rise 18% next quarter based on pipeline coverage targets.",
  },
  {
    icon: Target,
    tone: "evergreen" as const,
    title: "Smart recommendation",
    body: "Re-allocate 2 recruiters from Marketing to Engineering to cut time-to-fill by an estimated 4 days.",
  },
];

const toneCls = {
  coral: "bg-coral-50 text-coral-600 dark:bg-coral-900/30 dark:text-coral-300",
  gold: "bg-gold-50 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400",
  evergreen: "bg-evergreen-50 text-evergreen-700 dark:bg-evergreen-900/30 dark:text-evergreen-300",
};

export function AiInsights() {
  return (
    <div className="card-surface relative overflow-hidden p-5">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-100/40 blur-2xl dark:bg-gold-900/20" />
      <div className="relative mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-gold-300 dark:bg-gold-500 dark:text-ink-900">
          <Sparkles size={15} />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">AI Hiring Insights</h3>
          <p className="text-[11px] text-ink-400">Updated 12 minutes ago</p>
        </div>
      </div>
      <div className="relative space-y-3">
        {insights.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-3 rounded-xl border border-ink-100 p-3 dark:border-ink-700"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${toneCls[item.tone]}`}>
                <Icon size={15} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-400">{item.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
