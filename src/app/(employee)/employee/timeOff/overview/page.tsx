'use client';
import PageHeader from '@/components/layout/PageHeader';
import SummaryStrip      from '@/components/timeOff/SummaryStrip';
import LeaveBalanceTable from '@/components/timeOff/LeaveBalanceTable';
import UpcomingLeaves    from '@/components/timeOff/UpcomingLeaves';
import NotificationsAlerts from '@/components/timeOff/NotificationsAlerts';
import ManagerComments   from '@/components/timeOff/ManagerComments';
import QuickActions      from '@/components/timeOff/QuickActions';

export default function OverviewPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <PageHeader />
      <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
        <SummaryStrip />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <LeaveBalanceTable />
          </div>
          <div className="space-y-5">
            <UpcomingLeaves />
            <NotificationsAlerts />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ManagerComments />
          <QuickActions />
        </div>
      </div>
    </main>
  );
}
