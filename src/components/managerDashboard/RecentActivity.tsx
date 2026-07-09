"use client";

import { motion } from "framer-motion";
import { CheckCircle2, FileClock, GraduationCap, LogIn, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { recentActivity, type ActivityType, type ActivityItem } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

const activityMeta: Record<ActivityType, { icon: typeof LogIn; className: string }> = {
  "check-in": { icon: LogIn, className: "bg-blue-50 text-blue-600" },
  leave: { icon: FileClock, className: "bg-amber-50 text-amber-600" },
  approval: { icon: CheckCircle2, className: "bg-emerald-50 text-emerald-600" },
  training: { icon: GraduationCap, className: "bg-purple-50 text-purple-600" },
  goal: { icon: Target, className: "bg-indigo-50 text-indigo-600" },
};

export function RecentActivity() {
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
            Recent Activity
          </CardTitle>
          <p className="text-xs text-slate-400">Newest first</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="relative space-y-5 pl-2">
              <div className="absolute bottom-2 left-[15px] top-2 w-px bg-slate-100" />
              {recentActivity.map((item: ActivityItem) => {
                const meta = activityMeta[item.type as ActivityType];
                const Icon = meta.icon;
                return (
                  <div key={item.id} className="relative flex gap-3">
                    <div
                      className={cn(
                        "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        meta.className
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1 pb-0.5">
                      <p className="text-sm text-slate-700">
                        <span className="font-medium text-slate-900">{item.actor}</span>{" "}
                        {item.description}
                      </p>
                      <p className="text-xs text-slate-400">{item.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
