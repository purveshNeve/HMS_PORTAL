"use client";

import { motion } from "framer-motion";
import { buildMonthGrid, weekdayLabels } from "@/lib/date-utils";
import { CulturalEvent, Holiday } from "@/types/calendar";
import { cn } from "@/lib/utils";
import EventPill from "./EventPill";

const MAX_VISIBLE_EVENTS = 3;

export default function MonthView({
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
  const grid = buildMonthGrid(currentDate);

  return (
    <div className="overflow-hidden rounded-xl2 border border-line bg-card shadow-soft">
      <div className="grid grid-cols-7 border-b border-line bg-paper/60">
        {weekdayLabels().map((label) => (
          <div
            key={label}
            className="px-2 py-3 text-center text-[11px] font-semibold uppercase tracking-wide text-muted"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {grid.map((cell, idx) => {
          const dayEvents = eventsByDate.get(cell.iso) ?? [];
          const holiday = holidaysByDate.get(cell.iso);
          const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
          const hiddenCount = dayEvents.length - visibleEvents.length;

          return (
            <motion.div
              key={cell.iso}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: Math.min(idx * 0.006, 0.25) }}
              className={cn(
                "group relative flex min-h-[108px] flex-col gap-1 border-b border-r border-line/70 p-2 transition-colors sm:min-h-[128px] sm:p-2.5",
                idx % 7 === 6 && "border-r-0",
                !cell.isCurrentMonth && "bg-paper/50",
                cell.isWeekend && cell.isCurrentMonth && "bg-marigold-light/30",
                holiday && "bg-coral-light/40",
                "hover:bg-indigoink-light/40"
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                    cell.isToday
                      ? "bg-indigoink text-white shadow-glow"
                      : cell.isCurrentMonth
                        ? "text-ink"
                        : "text-muted/50"
                  )}
                >
                  {cell.day}
                </span>
                {holiday && (
                  <span className="text-[13px]" title={holiday.name}>
                    {holiday.icon}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1 overflow-visible">
                {visibleEvents.map((event) => (
                  <EventPill key={event.id} event={event} onSelect={onSelectEvent} />
                ))}
                {hiddenCount > 0 && (
                  <span className="px-1 text-[10.5px] font-medium text-muted">
                    +{hiddenCount} more
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
