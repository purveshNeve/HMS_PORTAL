import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { AuditTrail } from "@/features/compliance-risk/components/AuditTrail";
import { CandidatePipeline } from "@/features/talent-acquisition/components/CandidatePipeline";

export default function AdminDashboardPage() {
  const mockCandidates = [
    {
      id: "c1",
      fullName: "Jane Cooper",
      email: "jane@example.com",
      positionId: "p1",
      status: "interview" as const,
      appliedAt: new Date().toISOString(),
    },
    {
      id: "c2",
      fullName: "Robert Fox",
      email: "robert@example.com",
      positionId: "p2",
      status: "offer" as const,
      appliedAt: new Date().toISOString(),
    },
  ];

  const mockAudits = [
    {
      id: "a1",
      title: "Policy acknowledgement overdue",
      domain: "Compliance",
      severity: "medium" as const,
      occurredAt: new Date().toISOString(),
      resolved: false,
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Dashboard" },
        ]}
      />
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-foreground/60">
          Strategic overview across all HR domains
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Open Positions", value: "24" },
          { label: "Pending Offers", value: "8" },
          { label: "Compliance Alerts", value: "3" },
          { label: "Engagement Score", value: "78%" },
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
        <CandidatePipeline candidates={mockCandidates} />
        <AuditTrail events={mockAudits} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Workforce Analytics</CardTitle>
          <CardDescription>Headcount, turnover, and cost metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/50">
            Connect your data warehouse to populate executive KPIs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
