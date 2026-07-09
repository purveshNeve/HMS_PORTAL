// components/dashboard/EmployeeInsights.tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Briefcase, GraduationCap, FileSignature, Home, CalendarDays, User, Star } from "lucide-react";
import { useDashboardSection } from "@/lib/use-dashboard-section";
import type { EmployeeInsightsResponse } from "@/types/admindashboard";
import { SectionCard, SectionHeading, Skeleton, ErrorState } from "./DashboardStates";
import { formatNumber } from "@/lib/format";

const EMPLOYMENT_ROWS = [
  { key: "fullTime", label: "Full Time", icon: Briefcase, color: "text-indigo-600 bg-indigo-50" },
  { key: "interns", label: "Interns", icon: GraduationCap, color: "text-sky-600 bg-sky-50" },
  { key: "contract", label: "Contract", icon: FileSignature, color: "text-amber-600 bg-amber-50" },
  { key: "remote", label: "Remote", icon: Home, color: "text-emerald-600 bg-emerald-50" },
] as const;

export function EmployeeInsights({ refreshKey }: { refreshKey: number }) {
  const { data, isLoading, error, refetch } = useDashboardSection("insights", refreshKey);

  return (
    <SectionCard>
      <SectionHeading title="Employee Insights" />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading || !data ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full lg:col-span-2" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Gender Distribution</p>
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={data.genderDistribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={2}>
                  {data.genderDistribution.map((g) => (
                    <Cell key={g.name} fill={g.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f3f4f6", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2">
            <p className="mb-2 text-xs font-medium text-gray-500">Employment Type</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {EMPLOYMENT_ROWS.map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="rounded-lg border border-gray-100 p-3">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <p className="mt-2 text-lg font-semibold text-gray-900">{formatNumber(data.employmentType[key as keyof EmployeeInsightsResponse["employmentType"]])}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>

            <p className="mb-2 mt-4 text-xs font-medium text-gray-500">Averages</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-gray-100 p-3 text-center">
                <CalendarDays className="mx-auto h-4 w-4 text-gray-400" />
                <p className="mt-1 text-lg font-semibold text-gray-900">{data.averageExperienceYears}y</p>
                <p className="text-[11px] text-gray-500">Avg. Experience</p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3 text-center">
                <User className="mx-auto h-4 w-4 text-gray-400" />
                <p className="mt-1 text-lg font-semibold text-gray-900">{data.averageAge}</p>
                <p className="text-[11px] text-gray-500">Avg. Age</p>
              </div>
              <div className="rounded-lg border border-gray-100 p-3 text-center">
                <Star className="mx-auto h-4 w-4 text-gray-400" />
                <p className="mt-1 text-lg font-semibold text-gray-900">{data.averagePerformanceScore}/5</p>
                <p className="text-[11px] text-gray-500">Avg. Performance</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
