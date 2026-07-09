// components/dashboard/PayrollOverview.tsx
"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Wallet, Coins, CalendarClock } from "lucide-react";
import { useDashboardSection } from "@/lib/use-dashboard-section";
import { SectionCard, SectionHeading, Skeleton, ErrorState, EmptyState } from "./DashboardStates";
import { formatCurrency, formatDate } from "@/lib/format";

export function PayrollOverview({ refreshKey }: { refreshKey: number }) {
  const { data, isLoading, error, refetch } = useDashboardSection("payroll", refreshKey);

  return (
    <SectionCard>
      <SectionHeading title="Payroll Overview" subtitle="Last 12 months of payroll expenses" />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading || !data ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
          <Skeleton className="h-56 w-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-100 p-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Wallet className="h-4 w-4" />
              </span>
              <p className="mt-2 text-lg font-semibold text-gray-900">{formatCurrency(data.summary.totalMonthlyPayroll)}</p>
              <p className="text-xs text-gray-500">Total Monthly Payroll</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Coins className="h-4 w-4" />
              </span>
              <p className="mt-2 text-lg font-semibold text-gray-900">{formatCurrency(data.summary.averageSalary)}</p>
              <p className="text-xs text-gray-500">Average Salary</p>
            </div>
            <div className="rounded-lg border border-gray-100 p-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <CalendarClock className="h-4 w-4" />
              </span>
              <p className="mt-2 text-lg font-semibold text-gray-900">{formatDate(data.summary.nextProcessingDate, { month: "long", day: "numeric" })}</p>
              <p className="text-xs text-gray-500">Upcoming Salary Processing</p>
            </div>
          </div>

          {data.trend.length === 0 ? (
            <EmptyState message="No payroll history yet." />
          ) : (
            <ResponsiveContainer width="100%" height={260} className="mt-4">
              <AreaChart data={data.trend} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="payrollGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #f3f4f6", fontSize: 12 }}
                  formatter={(value: number | string | undefined) =>
                    typeof value === "number" ? formatCurrency(value) : ""
                  }
                />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2.5} fill="url(#payrollGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </SectionCard>
  );
}
