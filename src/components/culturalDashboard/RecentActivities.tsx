"use client";

import { motion } from "framer-motion";
import { UserPlus, Award, Users2, ClipboardList, MessageSquare } from "lucide-react";
import { recentActivities } from "@/data/dashboardData";
import { ActivityType } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const iconMap: Record<ActivityType, { icon: React.ElementType; bg: string; text: string }> = {
  joined: { icon: UserPlus, bg: "bg-indigoink-light", text: "text-indigoink" },
  certified: { icon: Award, bg: "bg-marigold-light", text: "text-marigold" },
  workshop: { icon: Users2, bg: "bg-teal-light", text: "text-teal" },
  assigned: { icon: ClipboardList, bg: "bg-slateblue-light", text: "text-slateblue" },
  feedback: { icon: MessageSquare, bg: "bg-pinkrose-light", text: "text-pinkrose" },
};

export default function RecentActivities() {
  return (
    <div className="rounded-xl2 border border-line bg-card p-5 shadow-soft">
      <h3 className="mb-4 font-display text-sm font-semibold text-ink">Recent Activities</h3>
      <ul className="space-y-1">
        {recentActivities.map((activity, i) => {
          const meta = iconMap[activity.type];
          const Icon = meta.icon;
          return (
            <motion.li
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-paper"
            >
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", meta.bg, meta.text)}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs leading-relaxed text-ink">
                  <span className="font-semibold">{activity.employee}</span> {activity.detail}
                </p>
                <p className="mt-0.5 text-[10.5px] text-muted">
                  {activity.department} · {activity.timeAgo}
                </p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
