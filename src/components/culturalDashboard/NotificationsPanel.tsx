"use client";

import { motion } from "framer-motion";
import { BellRing, AlarmClockOff, ClipboardList, MessageCircleMore } from "lucide-react";
import { notifications } from "@/data/dashboardData";
import { NotificationKind } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const kindMeta: Record<NotificationKind, { icon: React.ElementType; bg: string; text: string }> = {
  "certification-due": { icon: BellRing, bg: "bg-marigold-light", text: "text-marigold" },
  "certification-expired": { icon: AlarmClockOff, bg: "bg-coral-light", text: "text-coral" },
  "learning-pending": { icon: ClipboardList, bg: "bg-slateblue-light", text: "text-slateblue" },
  "manager-review": { icon: MessageCircleMore, bg: "bg-pinkrose-light", text: "text-pinkrose" },
};

export default function NotificationsPanel() {
  return (
    <div className="rounded-xl2 border border-line bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-ink">Notifications</h3>
        <span className="rounded-full bg-coral-light px-2 py-0.5 text-[11px] font-semibold text-coral">
          {notifications.length} new
        </span>
      </div>
      <ul className="space-y-1">
        {notifications.map((n, i) => {
          const meta = kindMeta[n.kind];
          const Icon = meta.icon;
          return (
            <motion.li
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-paper"
            >
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", meta.bg, meta.text)}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-xs font-semibold text-ink">{n.title}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{n.detail}</p>
                <p className="mt-0.5 text-[10.5px] text-muted/70">{n.timeAgo}</p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
