"use client";

import { motion } from "framer-motion";
import { CulturalEvent, Holiday } from "@/types/calendar";
import { toISODate, isSameDay } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import EventPill from "./EventPill";

export default function WeekView({
  currentDate,
  eventsByDate,
  holidaysByDate,
  onSelectEvent,
}: {
  currentDate: Date;
  eventsByDate: Map<string, CulturalEvent[]>;
  holidaysByDate: Map<string, Holiday>;
  onSelectEvent: (e: CulturalEvent) => void;
}) {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  const today = new Date();

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {days.map((day, i) => {
        const iso = toISODate(day);
        const dayEvents = eventsByDate.get(iso) ?? [];
        const holiday = holidaysByDate.get(iso);
        const isToday = isSameDay(day, today);
        const isWeekend = day.getDay() === 0 || day.getDay() === 6;

        return (
          <motion.div
            key={iso}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={cn(
              "flex min-h-[200px] flex-col gap-2 rounded-xl2 border border-line bg-card p-3 shadow-soft",
              isWeekend && "bg-marigold-light/20",
              holiday && "bg-coral-light/30"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold tabular-nums",
                    isToday ? "bg-indigoink text-white shadow-glow" : "text-ink"
                  )}
                >
                  {day.getDate()}
                </span>
              </div>
              {holiday && <span className="text-base">{holiday.icon}</span>}
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              {dayEvents.length === 0 ? (
                <p className="mt-2 text-[11px] text-muted/70">No events</p>
              ) : (
                dayEvents.map((event) => (
                  <EventPill key={event.id} event={event} onSelect={onSelectEvent} />
                ))
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
