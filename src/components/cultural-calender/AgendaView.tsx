"use client";

import { motion } from "framer-motion";
import { CulturalEvent } from "@/types/calendar";
import { formatFriendlyDate } from "@/lib/date-utils";
import { categoryStyles } from "@/lib/category-styles";
import CategoryBadge from "./CategoryBadge";
import { cn } from "@/lib/utils";

export default function AgendaView({
  events,
  onSelectEvent,
}: {
  events: CulturalEvent[];
  onSelectEvent: (e: CulturalEvent) => void;
}) {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl2 border border-dashed border-line bg-card p-10 text-center shadow-soft">
        <p className="text-sm text-muted">No events scheduled this month.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl2 border border-line bg-card shadow-soft">
      <ul className="divide-y divide-line/70">
        {sorted.map((event, i) => {
          const style = categoryStyles[event.category];
          return (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <button
                onClick={() => onSelectEvent(event)}
                className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-paper/70"
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg",
                    style.bg
                  )}
                >
                  {event.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-sm font-semibold text-ink">
                      {event.title}
                    </span>
                    <CategoryBadge category={event.category} />
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted">
                    {formatFriendlyDate(event.date)} · {event.time} · {event.venue}
                  </div>
                </div>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
