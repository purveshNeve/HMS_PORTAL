'use client';

import CalendarPage from '@/components/timeOff/Calender';

export default function TimeOffCalendarPage() {
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <CalendarPage />
      </div>
    </div>
  );
}
