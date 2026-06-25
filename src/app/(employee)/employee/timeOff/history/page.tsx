'use client';
import PageHeader from '@/components/layout/PageHeader';
import SummaryStrip      from '@/components/timeOff/SummaryStrip';
import LeaveApprovalTable from '@/components/timeOff/LeaveApprovalTable';
import ManagerComments   from '@/components/timeOff/ManagerComments';
import NotificationsAlerts from '@/components/timeOff/NotificationsAlerts';

export default function HistoryPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <PageHeader />
      <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
        <div className="space-y-5">
          <SummaryStrip />
          <LeaveApprovalTable />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ManagerComments />
            <NotificationsAlerts />
          </div>
        </div>
      </div>
    </main>
  );
}
