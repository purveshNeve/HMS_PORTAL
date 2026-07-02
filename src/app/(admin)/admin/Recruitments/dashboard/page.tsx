"use client";

import { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  UserCheck,
  CalendarClock,
  FileSignature,
  CheckCircle2,
  Percent,
  Clock,
  Wallet,
  FolderInput,
  FileDown,
  FileSpreadsheet,
} from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { KpiCard, KpiCardSkeleton } from "@/components/ui/KpiCard";
import { HiringTrendChart } from "@/components/recruitments/dashboard/HiringTrendChart";
import { DepartmentChart } from "@/components/recruitments/dashboard/DepartmentChart";
import { PipelineFunnelChart } from "@/components/recruitments/dashboard/PipelineFunnelChart";
import { OfferAcceptanceChart } from "@/components/recruitments/dashboard/OfferAcceptanceChart";
import { SourceAnalyticsChart } from "@/components/recruitments/dashboard/SourceAnalyticsChart";
import { RecruiterPerformanceTable } from "@/components/recruitments/dashboard/RecruiterPerformanceTable";
import { RecentActivityFeed } from "@/components/recruitments/dashboard/RecentActivityFeed";
import { QuickActions } from "@/components/recruitments/dashboard/QuickActions";
import { AiInsights } from "@/components/recruitments/dashboard/AiInsights";
import {
  kpiSummary,
  monthlyHiringTrend,
  departmentHiring,
  recruiterPerformance,
} from "@/lib/mock-data";
import { formatCompact, formatCurrency } from "@/lib/utils-copy";
import { exportToCsv, exportToPdf } from "@/lib/export";

const kpiConfig = [
  { key: "openPositions", label: "Open Positions", icon: Briefcase, format: (v: number) => formatCompact(v) },
  { key: "activeRecruitments", label: "Active Recruitments", icon: FolderInput, format: (v: number) => formatCompact(v) },
  { key: "applicationsReceived", label: "Applications Received", icon: Users, format: (v: number) => formatCompact(v) },
  { key: "candidatesShortlisted", label: "Candidates Shortlisted", icon: UserCheck, format: (v: number) => formatCompact(v) },
  { key: "interviewsScheduled", label: "Interviews Scheduled", icon: CalendarClock, format: (v: number) => formatCompact(v), goodDirection: "up" as const },
  { key: "offersReleased", label: "Offers Released", icon: FileSignature, format: (v: number) => formatCompact(v) },
  { key: "offersAccepted", label: "Offers Accepted", icon: CheckCircle2, format: (v: number) => formatCompact(v) },
  { key: "hiringSuccessRate", label: "Hiring Success Rate", icon: Percent, format: (v: number) => `${v}%` },
  { key: "avgTimeToHire", label: "Avg. Time to Hire", icon: Clock, format: (v: number) => `${v}d`, goodDirection: "down" as const },
  { key: "avgCostPerHire", label: "Avg. Cost per Hire", icon: Wallet, format: (v: number) => formatCurrency(v), goodDirection: "down" as const },
] as const;

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const handleExportExcel = () => {
    exportToCsv("recruitment-monthly-report", monthlyHiringTrend);
  };

  const handleExportPdf = () => {
    exportToPdf(
      "Recruitment Monthly Report",
      `Generated ${new Date().toDateString()} · Meridian HRMS`,
      [
        {
          heading: "Key Metrics",
          head: ["Metric", "Value"],
          body: kpiConfig.map((k) => [k.label, k.format(kpiSummary[k.key].value)]),
        },
        {
          heading: "Department Hiring",
          head: ["Department", "Open Positions", "Hires"],
          body: departmentHiring.map((d) => [d.department, d.openings, d.hires]),
        },
        {
          heading: "Recruiter Performance",
          head: ["Recruiter", "Hires", "Avg. Days", "Satisfaction"],
          body: recruiterPerformance.map((r) => [r.recruiter, r.hires, r.avgDays, r.satisfaction]),
        },
      ],
      "recruitment-monthly-report"
    );
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-[1400px] space-y-6">
        {/* KPI grid */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <KpiCardSkeleton key={i} />)
            : kpiConfig.map((k, i) => {
              const data = kpiSummary[k.key];
              return (
                <KpiCard
                  key={k.key}
                  index={i}
                  label={k.label}
                  value={k.format(data.value)}
                  delta={data.delta}
                  trend={data.trend}
                  goodDirection={"goodDirection" in k ? k.goodDirection : "up"}
                  icon={k.icon}
                />
              );
            })}
        </section>

        {/* Reports bar */}
        <section id="reports" className="card-surface flex flex-col items-start justify-between gap-3 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-ink-800 dark:text-ink-100">Monthly recruitment report</p>
            <p className="text-xs text-ink-400">Automatically compiled from live hiring data</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleExportPdf} className="btn-secondary text-xs">
              <FileDown size={14} /> Export PDF
            </button>
            <button onClick={handleExportExcel} className="btn-secondary text-xs">
              <FileSpreadsheet size={14} /> Export Excel
            </button>
          </div>
        </section>

        {/* Charts row 1 */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="card-surface p-5 lg:col-span-2">
            <ChartHeader title="Monthly Hiring Trend" subtitle="Applications received vs. successful hires" />
            <HiringTrendChart />
          </div>
          <div className="card-surface p-5">
            <ChartHeader title="Offer Acceptance Rate" subtitle="Last 90 days" />
            <OfferAcceptanceChart />
          </div>
        </section>

        {/* Charts row 2 */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="card-surface p-5">
            <ChartHeader title="Candidate Pipeline Funnel" subtitle="Conversion across every stage" />
            <PipelineFunnelChart />
          </div>
          <div className="card-surface p-5">
            <ChartHeader title="Department-wise Hiring" subtitle="Hires this year by department" />
            <DepartmentChart />
          </div>
          <div className="card-surface p-5">
            <ChartHeader title="Recruitment Source Analytics" subtitle="Where candidates come from" />
            <SourceAnalyticsChart />
          </div>
        </section>

        {/* Lower row: activity, recruiter performance, insights, quick actions */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="card-surface p-5 lg:col-span-1">
            <ChartHeader title="Recent Activity" subtitle="Live feed" />
            <RecentActivityFeed />
          </div>
          <div className="card-surface p-5 lg:col-span-1">
            <ChartHeader title="Recruiter Performance" subtitle="Ranked by hires closed" />
            <RecruiterPerformanceTable />
          </div>
          <div className="lg:col-span-1">
            <AiInsights />
          </div>
          <div className="card-surface p-5 lg:col-span-1">
            <ChartHeader title="Quick Actions" subtitle="Jump to what matters" />
            <QuickActions />
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function ChartHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <h3 className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">{title}</h3>
      <p className="text-xs text-ink-400">{subtitle}</p>
    </div>
  );
}
