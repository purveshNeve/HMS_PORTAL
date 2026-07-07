"use client";

import { motion } from "framer-motion";
import { CalendarDays, User, Users } from "lucide-react";
import { upcomingTrainings } from "@/data/dashboardData";
import { TrainingStatus } from "@/types/dashboard";
import { useToast } from "@/lib/toast";
import StatusBadge from "@/components/ui/StatusBadge";

const statusTone: Record<TrainingStatus, "success" | "warning" | "danger" | "neutral"> = {
  Open: "success",
  "Filling Fast": "warning",
  Full: "danger",
  Completed: "neutral",
};

export default function UpcomingTrainings() {
  const { toast } = useToast();

  return (
    <div className="rounded-xl2 border border-line bg-card p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-ink">Upcoming Trainings</h3>
        <span className="text-xs text-muted">{upcomingTrainings.length} scheduled</span>
      </div>
      <div className="space-y-3">
        {upcomingTrainings.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-xl border border-line bg-paper/50 p-3.5"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-ink">{t.title}</h4>
              <StatusBadge status={t.status} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-muted">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" /> {t.trainer}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" /> {t.date}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {t.seatsFilled}/{t.seatsTotal} seats
              </span>
            </div>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-indigoink"
                style={{ width: `${(t.seatsFilled / t.seatsTotal) * 100}%` }}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={() => toast(`Opened "${t.title}" details`, "info")}
                className="rounded-full border border-line px-3 py-1 text-[11px] font-medium text-ink transition-colors hover:bg-card"
              >
                Quick View
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
