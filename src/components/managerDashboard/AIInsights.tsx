"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { aiInsights, type InsightTone, type AIInsight } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

const toneMeta: Record<InsightTone, { icon: typeof TrendingUp; className: string }> = {
  positive: { icon: TrendingUp, className: "bg-emerald-50 text-emerald-600" },
  neutral: { icon: Sparkles, className: "bg-indigo-50 text-indigo-600" },
  warning: { icon: AlertTriangle, className: "bg-amber-50 text-amber-600" },
};

export function AIInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm bg-indigo-50/30">
        <CardHeader className="flex flex-row items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <CardTitle className="text-base font-semibold text-slate-800">
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {aiInsights.map((insight: AIInsight) => {
            const meta = toneMeta[insight.tone as InsightTone];
            const Icon = meta.icon;
            return (
              <div
                key={insight.id}
                className="flex gap-3 rounded-xl border border-slate-100 bg-white p-3.5"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    meta.className
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm leading-snug text-slate-600">{insight.text}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
