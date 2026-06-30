'use client';

import CalendarPage from '@/components/timeOff/Calender';

export default function ManagerCalendarPage() {
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Team Time Off Calendar
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            View all team member leave, work from home, and compensatory off schedules
          </p>
        </div>
        <CalendarPage />
      </div>
    </div>
  );
}
