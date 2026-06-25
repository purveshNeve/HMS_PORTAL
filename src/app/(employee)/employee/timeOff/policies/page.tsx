'use client';
import PageHeader from '@/components/layout/PageHeader';
import LeavePolicies     from '@/components/timeOff/LeavePolicies';
import QuickActions      from '@/components/timeOff/QuickActions';
import NotificationsAlerts from '@/components/timeOff/NotificationsAlerts';

export default function PoliciesPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <PageHeader />
      <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <LeavePolicies />
          </div>
          <div className="space-y-5">
            <QuickActions />
            <NotificationsAlerts />
          </div>
        </div>
      </div>
    </main>
  );
}
