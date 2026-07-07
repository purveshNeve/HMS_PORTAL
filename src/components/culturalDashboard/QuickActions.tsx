"use client";

import { motion } from "framer-motion";
import { PlusCircle, CalendarPlus, ClipboardCheck, FileBarChart2, UploadCloud } from "lucide-react";
import { useToast } from "@/lib/toast";

const actions = [
  { label: "Create Training", icon: PlusCircle, variant: "primary" as const },
  { label: "Schedule Workshop", icon: CalendarPlus, variant: "default" as const },
  { label: "Assign Learning", icon: ClipboardCheck, variant: "default" as const },
  { label: "Generate Report", icon: FileBarChart2, variant: "default" as const },
  { label: "Upload Resources", icon: UploadCloud, variant: "default" as const },
];

export default function QuickActions() {
  const { toast } = useToast();

  return (
    <div className="rounded-xl2 border border-line bg-card p-5 shadow-soft">
      <h3 className="mb-4 font-display text-sm font-semibold text-ink">Quick Actions</h3>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -2 }}
              onClick={() => toast(`${action.label} — this is a UI preview only.`, "info")}
              className={
                action.variant === "primary"
                  ? "flex items-center gap-2 rounded-xl bg-indigoink px-4 py-3 text-sm font-medium text-white shadow-soft transition-transform"
                  : "flex items-center gap-2 rounded-xl border border-line bg-paper/50 px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper"
              }
            >
              <Icon className="h-4 w-4" />
              {action.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
