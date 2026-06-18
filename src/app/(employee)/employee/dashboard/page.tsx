import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { PayslipCard } from "@/features/compensation-payroll/components/PayslipCard";
import { PtoBalanceCard } from "@/features/compensation-payroll/components/PtoBalanceCard";
import { GoalTracker } from "@/features/performance-development/components/GoalTracker";
import { ShoutoutBoard } from "@/features/employee-relations/components/ShoutoutBoard";

export default function EmployeeDashboardPage() {
  const mockPayslip = {
    id: "ps1",
    employeeId: "emp_001",
    periodStart: "2026-05-01",
    periodEnd: "2026-05-31",
    grossPay: 8500,
    netPay: 6200,
    currency: "USD",
    status: "paid" as const,
  };

  const mockPto = {
    employeeId: "emp_001",
    accrued: 20,
    used: 8,
    remaining: 12,
    unit: "days" as const,
  };

  const mockGoals = [
    {
      id: "g1",
      employeeId: "emp_001",
      title: "Complete leadership training",
      targetDate: "2026-08-01",
      progress: 40,
      status: "in_progress" as const,
    },
  ];

  const mockShoutouts = [
    {
      id: "s1",
      fromEmployeeId: "emp_002",
      toEmployeeId: "emp_001",
      message: "Great job on the quarterly presentation!",
      createdAt: new Date().toISOString(),
      reactions: 5,
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Employee", href: "/employee/dashboard" },
          { label: "Dashboard" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <p className="text-foreground/60">Your personal HR self-service hub</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PayslipCard payslip={mockPayslip} />
        <PtoBalanceCard balance={mockPto} />
        <GoalTracker goals={mockGoals} />
      </div>
      <ShoutoutBoard shoutouts={mockShoutouts} />
    </div>
  );
}
