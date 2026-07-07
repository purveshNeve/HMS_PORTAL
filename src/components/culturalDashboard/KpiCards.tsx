"use client";

import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Award,
  Gauge,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { kpiRawData } from "@/data/dashboardData";
import { cn } from "@/lib/utils";

const cards = [
  {
    id: "enrolled",
    label: "Total Employees Enrolled",
    data: kpiRawData.totalEnrolled,
    icon: Users,
    from: "#3730E0",
    to: "#5B4FF0",
  },
  {
    id: "programs",
    label: "Active Learning Programs",
    data: kpiRawData.activePrograms,
    icon: BookOpen,
    from: "#5B7FDB",
    to: "#7C9BEB",
  },
  {
    id: "events",
    label: "Upcoming Events",
    data: kpiRawData.upcomingEvents,
    icon: CalendarClock,
    from: "#E8A33D",
    to: "#F2BE6E",
  },
  {
    id: "completion",
    label: "Completion Rate",
    data: kpiRawData.completionRate,
    icon: CheckCircle2,
    suffix: "%",
    from: "#4C8B62",
    to: "#6FAE84",
  },
  {
    id: "certs",
    label: "Certifications Earned",
    data: kpiRawData.certificationsEarned,
    icon: Award,
    from: "#E0578A",
    to: "#EC85AA",
  },
  {
    id: "gap",
    label: "Skill Gap Index",
    data: kpiRawData.skillGapIndex,
    icon: Gauge,
    suffix: "%",
    from: "#34406B",
    to: "#4F5D8F",
  },
];

export default function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const positive = card.data.trend >= 0;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="rounded-xl2 border border-line bg-card p-4 shadow-soft"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-white"
              style={{ backgroundImage: `linear-gradient(135deg, ${card.from}, ${card.to})` }}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="mt-3 font-display text-2xl font-semibold tabular-nums text-ink">
              <AnimatedCounter value={card.data.value} />
              {card.suffix ?? ""}
            </div>
            <div className="mt-0.5 text-xs font-medium text-muted">{card.label}</div>
            <div
              className={cn(
                "mt-2.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                positive ? "bg-moss-light text-moss" : "bg-coral-light text-coral"
              )}
            >
              {positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(card.data.trend)}%
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
