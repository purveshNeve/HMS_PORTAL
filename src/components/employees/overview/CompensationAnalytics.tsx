"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import type { DashboardCharts } from "./types";

const PALETTE = [
  "#6366f1", "#8b5cf6", "#06b6d4", "#10b981",
  "#f59e0b", "#ef4444", "#ec4899", "#3b82f6",
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

function ChartCard({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="mb-0.5 text-sm font-semibold text-zinc-800 dark:text-zinc-100">{title}</p>
      {sub && <p className="mb-4 text-xs text-zinc-400">{sub}</p>}
      {!sub && <div className="mb-4" />}
      {children}
    </div>
  );
}

export default function CompensationAnalytics({ charts }: { charts: DashboardCharts }) {
  const deptData = useMemo(
    () =>
      charts.departmentBreakdown
        .sort((a, b) => b.totalMonthlySalary - a.totalMonthlySalary)
        .slice(0, 8),
    [charts.departmentBreakdown]
  );

  const designationData = useMemo(
    () => charts.designationSalaries.slice(0, 8),
    [charts.designationSalaries]
  );

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Salary Distribution Histogram */}
      <ChartCard
        title="Salary Distribution"
        sub="Number of employees per salary band (annual)"
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={charts.salaryDistribution} barSize={36}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(99,102,241,0.08)" }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
              formatter={(v) => [v, "Employees"]}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {charts.salaryDistribution.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Employment Type Pie */}
      <ChartCard
        title="Employment Type Mix"
        sub="Breakdown by contract type"
      >
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={charts.employmentTypeDistribution}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={40}
              paddingAngle={3}
              label={({ type, percent }) =>
                `${type} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {charts.employmentTypeDistribution.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              formatter={(v) => [v, "Employees"]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Department Salary Breakdown */}
      <ChartCard
        title="Department Payroll Expenditure"
        sub="Monthly salary spend per department"
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={deptData}
            layout="vertical"
            barSize={18}
            margin={{ left: 16, right: 16 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => fmt(v)}
            />
            <YAxis
              type="category"
              dataKey="department"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              formatter={(v) => [fmt(v as number), "Monthly Payroll"]}
            />
            <Bar dataKey="totalMonthlySalary" radius={[0, 8, 8, 0]}>
              {deptData.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Average Salary by Designation */}
      <ChartCard
        title="Avg Monthly Salary by Designation"
        sub="Top designations by compensation"
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={designationData}
            layout="vertical"
            barSize={18}
            margin={{ left: 16, right: 16 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => fmt(v)}
            />
            <YAxis
              type="category"
              dataKey="designation"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              width={110}
            />
            <Tooltip
              contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "12px" }}
              formatter={(v) => [fmt(v as number), "Avg Monthly"]}
            />
            <Bar dataKey="avgMonthly" radius={[0, 8, 8, 0]}>
              {designationData.map((_, i) => (
                <Cell key={i} fill={PALETTE[(i + 3) % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
