"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, PartyPopper } from "lucide-react";
import { CalendarView } from "@/types/calendar";
import { monthLabel, monthOptions } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

const VIEWS: CalendarView[] = ["month", "week", "agenda"];
const YEARS = [2025, 2026, 2027];

export default function CalendarHeader({
  currentDate,
  onPrev,
  onNext,
  onToday,
  onMonthSelect,
  onYearSelect,
  view,
  onViewChange,
}: {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onMonthSelect: (monthIndex: number) => void;
  onYearSelect: (year: number) => void;
  view: CalendarView;
  onViewChange: (v: CalendarView) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-20 -mx-4 mb-4 border-b border-line/70 bg-paper/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Left: Icon, Title, and Month Label */}
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigoink to-slateblue text-white shadow-soft shrink-0">
            <PartyPopper className="h-4 w-4" strokeWidth={2} />
          </span>
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink hidden sm:block">
            Cultural Calendar
          </h1>
          <div className="h-4 w-px bg-line/80 hidden sm:block"></div>
          <div className="font-display text-base font-medium text-muted">
            {monthLabel(currentDate)} {currentDate.getFullYear()}
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2.5">
          {/* Today / Prev / Next cluster */}
          <div className="flex items-center gap-1 rounded-full border border-line bg-card p-0.5 shadow-soft">
            <button
              onClick={onToday}
              className="rounded-full px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:bg-indigoink-light hover:text-indigoink"
            >
              Today
            </button>
            <button
              onClick={onPrev}
              aria-label="Previous month"
              className="rounded-full p-1 text-muted transition-colors hover:bg-indigoink-light hover:text-indigoink"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onNext}
              aria-label="Next month"
              className="rounded-full p-1 text-muted transition-colors hover:bg-indigoink-light hover:text-indigoink"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Month / Year selectors */}
          <div className="hidden md:flex items-center gap-1.5">
            <select
              value={currentDate.getMonth()}
              onChange={(e) => onMonthSelect(Number(e.target.value))}
              className="cursor-pointer rounded-full border border-line bg-card px-2.5 py-1 text-xs font-medium text-ink shadow-soft outline-none transition-colors hover:border-indigoink/40 focus:border-indigoink"
            >
              {monthOptions().map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={currentDate.getFullYear()}
              onChange={(e) => onYearSelect(Number(e.target.value))}
              className="cursor-pointer rounded-full border border-line bg-card px-2.5 py-1 text-xs font-medium text-ink shadow-soft outline-none transition-colors hover:border-indigoink/40 focus:border-indigoink"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* View switch */}
          <div className="flex items-center gap-0.5 rounded-full border border-line bg-card p-0.5 shadow-soft">
            {VIEWS.map((v) => (
              <button
                key={v}
                onClick={() => onViewChange(v)}
                className={cn(
                  "relative rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
                  view === v ? "text-white" : "text-muted hover:text-ink"
                )}
              >
                {view === v && (
                  <motion.span
                    layoutId="view-pill"
                    className="absolute inset-0 rounded-full bg-indigoink"
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{v}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
