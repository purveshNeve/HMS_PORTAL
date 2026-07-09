// components/dashboard/WorkforceOverview.tsx
"use client";

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { useDashboardSection } from "@/lib/use-dashboard-section";
import { SectionCard, SectionHeading, Skeleton, ErrorState, EmptyState } from "./DashboardStates";

export function WorkforceOverview({ refreshKey }: { refreshKey: number }) {
  const { data, isLoading, error, refetch } = useDashboardSection("workforce", refreshKey);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-10">
      <SectionCard className="lg:col-span-7">
        <SectionHeading title="Employee Growth" subtitle="Monthly headcount, Jan–Dec" />
        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : isLoading || !data ? (
          <Skeleton className="h-64 w-full" />
        ) : data.growth.length === 0 ? (
          <EmptyState message="No headcount data yet." />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.growth} margin={{ left: -20, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f3f4f6", fontSize: 12 }} />
              <Line type="monotone" dataKey="employees" stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </SectionCard>

      <SectionCard className="lg:col-span-3">
        <SectionHeading title="Department Distribution" />
        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : isLoading || !data ? (
          <Skeleton className="h-64 w-full" />
        ) : data.departments.length === 0 ? (
          <EmptyState message="No department data yet." />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data.departments} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={2}>
                {data.departments.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f3f4f6", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </SectionCard>
    </div>
  );
}
