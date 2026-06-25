'use client';
import PageHeader from '@/components/layout/PageHeader';
import LeaveRequestForm  from '@/components/timeOff/LeaveRequestForm';
import LeaveBalanceTable from '@/components/timeOff/LeaveBalanceTable';
import UpcomingLeaves    from '@/components/timeOff/UpcomingLeaves';

export default function LeavePage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <PageHeader />
      <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <LeaveRequestForm />
          </div>
          <div className="space-y-5">
            <LeaveBalanceTable />
            <UpcomingLeaves />
          </div>
        </div>
      </div>
    </main>
  );
}
