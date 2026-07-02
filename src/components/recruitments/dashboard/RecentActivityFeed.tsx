"use client";

import { motion } from "framer-motion";
import { UserPlus, CalendarCheck, FileSignature, DoorClosed } from "lucide-react";
import { recentActivity } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils-copy";
import { cn } from "@/lib/utils";

const iconMap = {
  application: { icon: UserPlus, cls: "bg-sky-50 text-sky-600" },
  interview: { icon: CalendarCheck, cls: "bg-gold-50 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400" },
  offer: { icon: FileSignature, cls: "bg-evergreen-50 text-evergreen-700 dark:bg-evergreen-900/30 dark:text-evergreen-400" },
  closed: { icon: DoorClosed, cls: "bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-300" },
};

export function RecentActivityFeed() {
  return (
    <div className="relative space-y-5 pl-1">
      <div className="absolute bottom-2 left-[19px] top-2 w-px bg-ink-100 dark:bg-ink-700" aria-hidden />
      {recentActivity.map((item, i) => {
        const { icon: Icon, cls } = iconMap[item.type];
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative flex gap-3"
          >
            <div className={cn("relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-surface-light dark:ring-surface-dark", cls)}>
              <Icon size={15} />
            </div>
            <div className="min-w-0 flex-1 pb-0.5">
              <p className="text-sm font-medium leading-snug text-ink-800 dark:text-ink-100">{item.title}</p>
              <p className="text-xs text-ink-400">{item.subtitle}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-ink-300">{timeAgo(item.time)}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
