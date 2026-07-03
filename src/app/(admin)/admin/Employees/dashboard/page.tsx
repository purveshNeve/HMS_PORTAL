"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  RefreshCw, AlertCircle, Users, IndianRupee, Clock,
} from "lucide-react";
import type { DashboardData } from "@/components/employees/overview/types";
import { DashboardSkeleton } from "@/components/employees/overview/DashboardSkeleton";
import EmployeeStatsCards from "@/components/employees/overview/EmployeeStatsCards";
import CompensationAnalytics from "@/components/employees/overview/CompensationAnalytics";
import TeamInsights from "@/components/employees/overview/TeamInsights";
import AttendanceOverview from "@/components/employees/overview/AttendanceOverview";
import PayrollReadiness from "@/components/employees/overview/PayrollReadiness";
import RecentActivities from "@/components/employees/overview/RecentActivities";
import QuickActions from "@/components/employees/overview/QuickActions";

const fmtCr = (n: number) => {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
};

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">{title}</h2>
      {sub && <p className="mt-0.5 text-xs text-zinc-400">{sub}</p>}
    </div>
  );
}

export default function EmployeesDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchDashboard = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/employees");
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const json: DashboardData = await res.json();
      if (!json.ok) throw new Error("API returned an error");
      setData(json);
      setLastRefreshed(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  // 60-second polling
  useEffect(() => {
    const id = setInterval(() => fetchDashboard(true), 60_000);
    return () => clearInterval(id);
  }, [fetchDashboard]);

  // Derived top-level stats for the hero header
  const heroStats = useMemo(() => {
    if (!data) return null;
    const { kpis } = data;
    const deptCount = data.charts.departmentBreakdown.length;
    return { kpis, deptCount };
  }, [data]);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-zinc-500">
        <AlertCircle size={40} className="text-rose-400" />
        <p className="text-sm font-medium">{error}</p>
        <button
          onClick={() => fetchDashboard()}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { kpis, charts, insights, employees, meta } = data;

  return (
    <div className="space-y-8">

      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-lg">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-8 right-24 h-32 w-32 rounded-full bg-white/5" />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Employee Compensation Dashboard
            </h1>
            <p className="mt-1 text-sm text-white/70">
              All metrics are computed live from the database · {meta.month}
            </p>
            {lastRefreshed && (
              <p className="mt-0.5 text-xs text-white/50">
                Last refreshed: {lastRefreshed.toLocaleTimeString("en-IN")}
              </p>
            )}
          </div>
          <button
            onClick={() => fetchDashboard()}
            className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/25"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Hero KPIs inside the banner */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {heroStats && [
            {
              icon: <Users size={16} />,
              label: "Employees",
              value: String(heroStats.kpis.totalEmployees),
            },
            {
              icon: <IndianRupee size={16} />,
              label: "Monthly Payroll",
              value: fmtCr(heroStats.kpis.totalMonthlyPayroll),
            },
            {
              icon: <IndianRupee size={16} />,
              label: "Annual CTC",
              value: fmtCr(heroStats.kpis.totalAnnualCTC),
            },
            {
              icon: <Clock size={16} />,
              label: "Avg Tenure",
              value: `${heroStats.kpis.avgTenure} yrs`,
            },
          ].map((h) => (
            <div key={h.label} className="rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 text-white/70">
                {h.icon}
                <p className="text-xs">{h.label}</p>
              </div>
              <p className="mt-1 text-xl font-black">{h.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────── */}
      <div>
        <SectionHeader
          title="Key Performance Indicators"
          sub="Real-time metrics computed from live employee data"
        />
        <EmployeeStatsCards kpis={kpis} totalEmployees={kpis.totalEmployees} />
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────────── */}
      <QuickActions />

      {/* ── Compensation Analytics ────────────────────────────────────── */}
      <div>
        <SectionHeader
          title="Compensation Analytics"
          sub="Salary distribution, department spend, and designation benchmarks"
        />
        <CompensationAnalytics charts={charts} />
      </div>

      {/* ── Team Insights ─────────────────────────────────────────────── */}
      <div>
        <SectionHeader
          title="Team Insights"
          sub="Top earners, longest tenures, new joiners, and upcoming milestones"
        />
        <TeamInsights insights={insights} />
      </div>

      {/* ── Attendance + Payroll Readiness ────────────────────────────── */}
      <div>
        <SectionHeader
          title="Operations Overview"
          sub="Attendance patterns and payroll submission status"
        />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <AttendanceOverview kpis={kpis} employees={employees} />
          <PayrollReadiness kpis={kpis} employees={employees} />
        </div>
      </div>

      {/* ── Employee Directory Table ───────────────────────────────────── */}
      <div>
        <SectionHeader
          title="Employee Directory"
          sub={`All ${employees.length} employees — sorted by monthly compensation`}
        />
        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/60">
                  {["Employee", "Department", "Designation", "Type", "Monthly", "Annual CTC", "Tenure", "Status"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-zinc-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...employees]
                  .sort((a, b) => b.monthlySalary - a.monthlySalary)
                  .map((e, i) => (
                    <tr
                      key={e.userId}
                      className={`border-b border-zinc-50 transition-colors hover:bg-indigo-50/40 dark:border-zinc-800 dark:hover:bg-indigo-900/10 ${
                        i % 2 === 1 ? "bg-zinc-50/40 dark:bg-zinc-800/20" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          {e.profileImage ? (
                            <img src={e.profileImage} alt={e.name} className="h-7 w-7 rounded-lg object-cover" />
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-[10px] font-bold text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300">
                              {e.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{e.name}</p>
                            <p className="text-[11px] text-zinc-400">{e.userId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                        {e.department || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                        {e.designation || e.role}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {e.employmentType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(e.monthlySalary)}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-300">
                        {fmtCr(e.annualCTC)}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-500 dark:text-zinc-400">
                        {e.tenureYears.toFixed(1)} yrs
                      </td>
                      <td className="px-4 py-3">
                        {e.onLeave ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            On Leave
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Recent Activities ─────────────────────────────────────────── */}
      <div>
        <SectionHeader
          title="Recent Team Activities"
          sub="Auto-generated feed from live database events"
        />
        <RecentActivities employees={employees} />
      </div>

      {/* Footer */}
      <p className="pb-4 text-center text-xs text-zinc-300 dark:text-zinc-600">
        All data sourced live from MongoDB · Generated {meta.generatedAt ? new Date(meta.generatedAt).toLocaleString("en-IN") : ""}
      </p>
    </div>
  );
}