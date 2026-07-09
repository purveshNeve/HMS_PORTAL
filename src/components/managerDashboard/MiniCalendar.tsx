"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { miniCalendarEvents, type CalendarEventType, type CalendarDayEvent } from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const eventDotClass: Record<CalendarEventType, string> = {
  meeting: "bg-indigo-500",
  leave: "bg-amber-500",
  deadline: "bg-rose-500",
};

export function MiniCalendar() {
  // Fixed reference date so the demo always shows a populated month (July 2026).
  const [cursor] = useState(new Date(2026, 6, 1));

  const { daysInMonth, startOffset, monthLabel } = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return {
      daysInMonth: lastDay.getDate(),
      startOffset: firstDay.getDay(),
      monthLabel: cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
  }, [cursor]);

  const eventsByDate = useMemo(() => {
    const map = new Map<number, CalendarDayEvent[]>();
    miniCalendarEvents.forEach((event: CalendarDayEvent) => {
      const existing = map.get(event.date) ?? [];
      existing.push(event);
      map.set(event.date, existing);
    });
    return map;
  }, []);

  const cells = (Array.from(
  { length: startOffset },
  () => null
) as (number | null)[]).concat(
  Array.from({ length: daysInMonth }, (_, i) => i + 1)
);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-800">{monthLabel}</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-7 w-7 rounded-lg" disabled>
              <ChevronLeft className="h-4 w-4 text-slate-400" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 w-7 rounded-lg" disabled>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TooltipProvider delayDuration={150}>
            <div className="grid grid-cols-7 gap-y-2 text-center">
              {WEEKDAYS.map((d, i) => (
                <span key={`${d}-${i}`} className="text-xs font-medium text-slate-400">
                  {d}
                </span>
              ))}
              {cells.map((day: number | null, idx: number) => {
                if (day === null) return <span key={`empty-${idx}`} />;
                const events = eventsByDate.get(day);
                const isToday = day === 9;
                return (
                  <div key={day} className="flex flex-col items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors",
                            isToday
                              ? "bg-indigo-600 font-semibold text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          )}
                        >
                          {day}
                        </span>
                      </TooltipTrigger>
                      {events && (
                        <TooltipContent className="rounded-lg text-xs">
                          {events.map((e: CalendarDayEvent) => (
                            <p key={e.label}>{e.label}</p>
                          ))}
                        </TooltipContent>
                      )}
                    </Tooltip>
                    <div className="flex h-1.5 gap-0.5">
                      {events?.map((e: CalendarDayEvent) => (
                        <span
                          key={e.label}
                          className={cn("h-1.5 w-1.5 rounded-full", eventDotClass[e.type as CalendarEventType])}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </TooltipProvider>

          <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Meetings
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Leaves
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Deadlines
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
