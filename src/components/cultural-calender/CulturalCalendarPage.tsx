"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { culturalEvents, holidays, birthdays } from "@/data/culturalEvents";
import { CalendarView, CulturalEvent } from "@/types/calendar";
import { toISODate } from "@/lib/date-utils";

import CalendarHeader from "./CalendarHeader";
import SummaryCards from "./SummaryCards";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import AgendaView from "./AgendaView";
import Sidebar from "./Sidebar";
import EventModal from "./EventModal";
import UpcomingEvents from "./UpcomingEvents";
import HolidayTimeline from "./HolidayTimeline";
import BirthdaySection from "./BirthdaySection";
import CalendarSkeleton from "./CalendarSkeleton";

// Fixed "today" so the demo data (hardcoded around this date) always looks intentional.
const TODAY = new Date("2026-07-06T00:00:00");

export default function CulturalCalendarPage() {
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date(TODAY));
  const [view, setView] = useState<CalendarView>("month");
  const [selectedEvent, setSelectedEvent] = useState<CulturalEvent | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
  }, []);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CulturalEvent[]>();
    for (const event of culturalEvents) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    return map;
  }, []);

  const holidaysByDate = useMemo(() => {
    const map = new Map<string, (typeof holidays)[number]>();
    for (const h of holidays) map.set(h.date, h);
    return map;
  }, []);

  const monthEvents = useMemo(() => {
    return culturalEvents.filter((e) => {
      const d = new Date(e.date + "T00:00:00");
      return (
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    });
  }, [currentDate]);

  const todaysEvents = useMemo(
    () => eventsByDate.get(toISODate(TODAY)) ?? [],
    [eventsByDate]
  );

  const upcomingEvents = useMemo(() => {
    const todayIso = toISODate(TODAY);
    return culturalEvents
      .filter((e) => e.date >= todayIso)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  const workshopCount = useMemo(
    () => culturalEvents.filter((e) => e.category === "Workshop").length,
    []
  );

  const goToday = () => setCurrentDate(new Date(TODAY));
  const goPrev = () => {
    const d = new Date(currentDate);
    d.setDate(1);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };
  const goNext = () => {
    const d = new Date(currentDate);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };
  const selectMonth = (m: number) => {
    const d = new Date(currentDate);
    d.setDate(1);
    d.setMonth(m);
    setCurrentDate(d);
  };
  const selectYear = (y: number) => {
    const d = new Date(currentDate);
    d.setFullYear(y);
    setCurrentDate(d);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <CalendarHeader
        currentDate={currentDate}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        onMonthSelect={selectMonth}
        onYearSelect={selectYear}
        view={view}
        onViewChange={setView}
      />

      {loading ? (
        <CalendarSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="space-y-8"
        >
          <SummaryCards
            upcomingCount={upcomingEvents.length}
            holidayCount={holidays.length}
            workshopCount={workshopCount}
            birthdayCount={birthdays.length}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              {view === "month" && (
                <MonthView
                  currentDate={currentDate}
                  eventsByDate={eventsByDate}
                  holidaysByDate={holidaysByDate}
                  onSelectEvent={setSelectedEvent}
                />
              )}
              {view === "week" && (
                <WeekView
                  currentDate={currentDate}
                  eventsByDate={eventsByDate}
                  holidaysByDate={holidaysByDate}
                  onSelectEvent={setSelectedEvent}
                />
              )}
              {view === "agenda" && (
                <AgendaView events={monthEvents} onSelectEvent={setSelectedEvent} />
              )}
            </div>

            <Sidebar
              todaysEvents={todaysEvents}
              upcomingEvents={upcomingEvents.slice(0, 5)}
              upcomingBirthdays={birthdays.slice(0, 5)}
              holidays={holidays}
              onSelectEvent={setSelectedEvent}
            />
          </div>

          <UpcomingEvents events={upcomingEvents.slice(0, 8)} onSelectEvent={setSelectedEvent} />
          <HolidayTimeline holidays={holidays} />
          <BirthdaySection birthdays={birthdays} />
        </motion.div>
      )}

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </main>
  );
}
