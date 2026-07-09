// components/dashboard/AttendanceOverview.tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Clock3, Hourglass, CheckCircle2, XCircle } from "lucide-react";
import { useDashboardSection } from "@/lib/use-dashboard-section";
import type { AttendanceBreakdown, AttendanceResponse } from "@/types/admindashboard";
import { SectionCard, SectionHeading, Skeleton, ErrorState } from "./DashboardStates";
import { formatNumber } from "@/lib/format";

const ATTENDANCE_COLORS: Record<string, string> = {
  present: "#10b981",
  absent: "#f43f5e",
  late: "#f59e0b",
  workFromHome: "#6366f1",
};

const ATTENDANCE_LABELS: Record<string, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  workFromHome: "Work From Home",
};

const LEAVE_ROWS = [
  { key: "pending", label: "Pending Leaves", icon: Hourglass, color: "text-amber-600 bg-amber-50" },
  { key: "approved", label: "Approved Leaves", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
  { key: "rejected", label: "Rejected Leaves", icon: XCircle, color: "text-rose-600 bg-rose-50" },
  { key: "onLeaveToday", label: "On Leave Today", icon: Clock3, color: "text-indigo-600 bg-indigo-50" },
] as const;

export function AttendanceOverview({ refreshKey }: { refreshKey: number }) {
  const { data, isLoading, error, refetch } = useDashboardSection("attendance", refreshKey);

  const attendanceData = data
    ? (Object.entries(data.attendance) as [keyof AttendanceBreakdown, number][]).map(([key, value]) => ({
        key,
        name: ATTENDANCE_LABELS[key],
        value,
        color: ATTENDANCE_COLORS[key],
      }))
    : [];
  const total = attendanceData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <SectionCard>
        <SectionHeading title="Attendance Summary" subtitle="Today" />
        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : isLoading || !data ? (
          <Skeleton className="h-56 w-full" />
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="relative h-44 w-44 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={attendanceData} dataKey="value" innerRadius={55} outerRadius={75} paddingAngle={3} startAngle={90} endAngle={-270}>
                    {attendanceData.map((d) => (
                      <Cell key={d.key} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-semibold text-gray-900">{total}</span>
                <span className="text-[11px] text-gray-400">Employees</span>
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-2">
              {attendanceData.map((d) => (
                <div key={d.key} className="flex items-center gap-2 rounded-lg border border-gray-100 p-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{formatNumber(d.value)}</p>
                    <p className="text-[11px] text-gray-500">{d.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard>
        <SectionHeading title="Leave Status" />
        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : isLoading || !data ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {LEAVE_ROWS.map(({ key, label, icon: Icon, color }) => (
              <div key={key} className="rounded-lg border border-gray-100 p-3">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-2 text-lg font-semibold text-gray-900">{formatNumber(data.leave[key as keyof AttendanceResponse["leave"]])}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
