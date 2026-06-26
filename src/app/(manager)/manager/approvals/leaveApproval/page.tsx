import LeaveApprovalCards from '@/components/timeOff/LeaveApprovalCards';
export default function LeaveApprovalPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-4 lg:p-6 space-y-5 max-w-screen-2xl mx-auto">
        <LeaveApprovalCards />
      </div>
    </main>
  );
}