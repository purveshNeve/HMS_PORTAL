'use client';
import PageHeader from '@/components/layout/PageHeader';
import HolidayCalendar   from '@/components/timeOff/HolidayCalendar';
import TeamAvailability  from '@/components/timeOff/TeamAvailability';
import AttendanceInsights from '@/components/timeOff/AttendanceInsights';

export default function CalendarPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <PageHeader />
      <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
        <div className="space-y-5">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2">
              <HolidayCalendar />
            </div>
            <div className="space-y-5">
              <TeamAvailability />
              <AttendanceInsights />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
