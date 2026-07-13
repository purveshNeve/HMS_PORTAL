"use client";

import { motion } from "framer-motion";
import { CalendarDays, Cake, Sparkles, Landmark } from "lucide-react";
import { CulturalEvent, Holiday, Birthday } from "@/types/calendar";
import { formatShortDate } from "@/lib/date-utils";
import { categoryStyles } from "@/lib/category-styles";
import { cn } from "@/lib/utils";

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl2 border border-line bg-card p-4 shadow-soft"
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigoink-light text-indigoink">
          {icon}
        </span>
        <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

export default function Sidebar({
  todaysEvents,
  upcomingEvents,
  upcomingBirthdays,
  holidays,
  onSelectEvent,
}: {
  todaysEvents: CulturalEvent[];
  upcomingEvents: CulturalEvent[];
  upcomingBirthdays: Birthday[];
  holidays: Holiday[];
  onSelectEvent: (e: CulturalEvent) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* <SectionCard icon={<CalendarDays className="h-3.5 w-3.5" />} title="Today's Events">
        {todaysEvents.length === 0 ? (
          <p className="text-xs text-muted">Nothing scheduled today — enjoy the calm.</p>
        ) : (
          <ul className="space-y-2">
            {todaysEvents.map((e) => {
              const style = categoryStyles[e.category];
              return (
                <li key={e.id}>
                  <button
                    onClick={() => onSelectEvent(e)}
                    className="flex w-full items-start gap-2 rounded-lg p-1.5 text-left transition-colors hover:bg-paper"
                  >
                    <span className={cn("mt-1 h-1.5 w-1.5 shrink-0 rounded-full", style.dot)} />
                    <div>
                      <div className="text-xs font-medium text-ink">
                        {e.emoji} {e.title}
                      </div>
                      <div className="text-[11px] text-muted">{e.time}</div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </SectionCard> */}

      <SectionCard icon={<Sparkles className="h-3.5 w-3.5" />} title="Upcoming Highlights">
        <ul className="space-y-2">
          {upcomingEvents.map((e) => {
            const style = categoryStyles[e.category];
            return (
              <li key={e.id}>
                <button
                  onClick={() => onSelectEvent(e)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg p-1.5 text-left transition-colors hover:bg-paper"
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", style.dot)} />
                    <span className="text-xs font-medium text-ink">
                      {e.emoji} {e.title}
                    </span>
                  </div>
                  <span className="shrink-0 text-[10.5px] font-medium text-muted">
                    {formatShortDate(e.date)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      {/* <SectionCard icon={<Cake className="h-3.5 w-3.5" />} title="Birthdays">
        <ul className="space-y-2">
          {upcomingBirthdays.map((b) => (
            <li key={b.id} className="flex items-center gap-2.5 rounded-lg p-1.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pinkrose-light text-[10.5px] font-semibold text-pinkrose">
                {b.initials}
              </span>
              <div>
                <div className="text-xs font-medium text-ink">{b.name}</div>
                <div className="text-[11px] text-muted">
                  {b.department} · {formatShortDate(b.date)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard> */}

      {/* <SectionCard icon={<Landmark className="h-3.5 w-3.5" />} title="Holiday List">
        <ul className="space-y-2">
          {holidays.slice(0, 5).map((h) => (
            <li key={h.id} className="flex items-center justify-between gap-2 rounded-lg p-1.5">
              <span className="text-xs font-medium text-ink">
                {h.icon} {h.name}
              </span>
              <span className="text-[10.5px] font-medium text-muted">
                {formatShortDate(h.date)}
              </span>
            </li>
          ))}
        </ul>
      </SectionCard> */}
    </div>
  );
}
