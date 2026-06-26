import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
export default function ManagerDashboardPage() {  
  const mockGoals = [
    {
      id: "g1",
      employeeId: "emp_002",
      title: "Complete Q2 sales target",
      targetDate: "2026-06-30",
      progress: 65,
      status: "in_progress" as const,
    },
  ];

  const mockTasks = [
    {
      id: "t1",
      employeeId: "emp_003",
      title: "Set up workstation",
      completed: true,
      dueDate: new Date().toISOString(),
    },
    {
      id: "t2",
      employeeId: "emp_003",
      title: "Complete security training",
      completed: false,
      dueDate: new Date().toISOString(),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Manager", href: "/manager/dashboard" },
          { label: "Dashboard" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <p className="text-foreground/60">Operational view of your direct reports</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { label: "Team Size", value: "12" },
          { label: "Pending Approvals", value: "5" },
          { label: "Onboarding Tasks", value: "3" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Team Calendar</CardTitle>
          <CardDescription>Upcoming PTO, reviews, and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/50">
            Integrate with your calendar provider to display team events.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
