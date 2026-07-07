"use client";

import { motion } from "framer-motion";
import { CalendarClock, Landmark, GraduationCap, Cake, TrendingUp } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

interface StatCard {
  label: string;
  value: number;
  trend: string;
  icon: React.ReactNode;
  from: string;
  to: string;
}

export default function SummaryCards({
  upcomingCount,
  holidayCount,
  workshopCount,
  birthdayCount,
}: {
  upcomingCount: number;
  holidayCount: number;
  workshopCount: number;
  birthdayCount: number;
}) {
  const cards: StatCard[] = [
    {
      label: "Upcoming Events",
      value: upcomingCount,
      trend: "+18% this quarter",
      icon: <CalendarClock className="h-5 w-5" strokeWidth={2} />,
      from: "#3730E0",
      to: "#5B4FF0",
    },
    {
      label: "Company Holidays",
      value: holidayCount,
      trend: "Full year listed",
      icon: <Landmark className="h-5 w-5" strokeWidth={2} />,
      from: "#E8A33D",
      to: "#F2BE6E",
    },
    {
      label: "Workshops",
      value: workshopCount,
      trend: "+2 added this month",
      icon: <GraduationCap className="h-5 w-5" strokeWidth={2} />,
      from: "#5B7FDB",
      to: "#7C9BEB",
    },
    {
      label: "Birthdays",
      value: birthdayCount,
      trend: "This month",
      icon: <Cake className="h-5 w-5" strokeWidth={2} />,
      from: "#E0578A",
      to: "#EC85AA",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
          whileHover={{ y: -4 }}
          className="relative overflow-hidden rounded-xl p-4 text-white shadow-soft"
          style={{
            backgroundImage: `linear-gradient(135deg, ${card.from}, ${card.to})`,
          }}
        >
          <div className="flex items-start justify-between">
            <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
              {card.icon}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium backdrop-blur-sm">
              <TrendingUp className="h-3 w-3" />
              {card.trend}
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-semibold tabular-nums">
            <AnimatedCounter value={card.value} />
          </div>
          <div className="mt-0.5 text-xs font-medium text-white/85">{card.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
