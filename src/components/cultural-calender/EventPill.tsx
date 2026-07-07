"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MapPin, User } from "lucide-react";
import { CulturalEvent } from "@/types/calendar";
import { categoryStyles } from "@/lib/category-styles";
import { cn } from "@/lib/utils";

export default function EventPill({
  event,
  onSelect,
}: {
  event: CulturalEvent;
  onSelect: (e: CulturalEvent) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const style = categoryStyles[event.category];

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => onSelect(event)}
        className={cn(
          "flex w-full items-center gap-1 truncate rounded-md px-1.5 py-0.5 text-left text-[11px] font-medium transition-transform hover:scale-[1.03]",
          style.bg,
          style.text
        )}
      >
        <span>{event.emoji}</span>
        <span className="truncate">{event.title}</span>
      </button>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-full z-30 mt-2 w-60 -translate-x-1/2 rounded-xl border border-line bg-card p-3.5 text-left shadow-soft"
          >
            <div className="flex items-center gap-1.5">
              <span
                className={cn("h-2 w-2 rounded-full", style.dot)}
              />
              <span className="font-display text-sm font-semibold text-ink">
                {event.emoji} {event.title}
              </span>
            </div>
            <div className="mt-2 space-y-1 text-[11.5px] text-muted">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> {event.time}
                {event.endTime ? ` – ${event.endTime}` : ""}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> {event.venue}
              </div>
              <div className="flex items-center gap-1.5">
                <User className="h-3 w-3" /> {event.organizer}
              </div>
            </div>
            <p className="mt-2 line-clamp-2 text-[11.5px] leading-relaxed text-muted">
              {event.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
