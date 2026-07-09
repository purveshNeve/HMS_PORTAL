"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Progress from "@/components/ui/ProgressBar";
import { goalProgress } from "@/lib/mock/dashboard";

function CircularCompletion({ percent }: { percent: number }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg viewBox="0 0 110 110" className="h-32 w-32 -rotate-90">
        <circle cx="55" cy="55" r={radius} strokeWidth="10" className="stroke-slate-100" fill="none" />
        <motion.circle
          cx="55"
          cy="55"
          r={radius}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          className="stroke-indigo-500"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-semibold text-slate-900">{percent}%</span>
        <span className="text-[11px] text-slate-400">Completed</span>
      </div>
    </div>
  );
}

export function GoalProgress() {
  const { quarterLabel, completionPercent, completed, pending, overdue } = goalProgress;
  const total = completed + pending + overdue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm h-full">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-800">
            Goal Progress
          </CardTitle>
          <p className="text-xs text-slate-400">{quarterLabel} goal completion</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <CircularCompletion percent={completionPercent} />

          <div className="w-full flex-1 space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="font-medium text-slate-600">Completed</span>
                <span className="text-slate-400">{completed}/{total}</span>
              </div>
              <Progress value={(completed / total) * 100} className="h-2 [&>div]:bg-emerald-500" />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="font-medium text-slate-600">Pending</span>
                <span className="text-slate-400">{pending}/{total}</span>
              </div>
              <Progress value={(pending / total) * 100} className="h-2 [&>div]:bg-amber-500" />
            </div>
            <div>
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="font-medium text-slate-600">Overdue</span>
                <span className="text-slate-400">{overdue}/{total}</span>
              </div>
              <Progress value={(overdue / total) * 100} className="h-2 [&>div]:bg-rose-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
