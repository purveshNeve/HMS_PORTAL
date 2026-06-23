import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
export default function EmployeeDashboardPage() {
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
      </div>
    </div>
  );
}
