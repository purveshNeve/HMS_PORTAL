'use client';
import PageHeader from '@/components/layout/PageHeader';
import WFHRequests       from '@/components/timeOff/WFHRequests';
import CompOffManagement from '@/components/timeOff/CompOffManagement';
import AttendanceInsights from '@/components/timeOff/AttendanceInsights';

export default function WfhCompOffPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <PageHeader />
      <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-5">
            <WFHRequests />
          </div>
          <div className="space-y-5">
            <CompOffManagement />
            <AttendanceInsights />
          </div>
        </div>
      </div>
    </main>
  );
}
