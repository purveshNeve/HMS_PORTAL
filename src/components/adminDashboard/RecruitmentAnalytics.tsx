// components/dashboard/RecruitmentAnalytics.tsx
"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { FileText, CalendarCheck2, MailCheck, Percent } from "lucide-react";
import { useDashboardSection } from "@/lib/use-dashboard-section";
import { SectionCard, SectionHeading, Skeleton, ErrorState, EmptyState } from "./DashboardStates";
import { formatNumber, formatPercent } from "@/lib/format";

const SUMMARY_CARDS = [
  { key: "applicationsReceived", label: "Applications Received", deltaKey: "applicationsDelta", icon: FileText, color: "text-indigo-600 bg-indigo-50" },
  { key: "interviewsScheduled", label: "Interviews Scheduled", deltaKey: "interviewsDelta", icon: CalendarCheck2, color: "text-sky-600 bg-sky-50" },
  { key: "offersSent", label: "Offers Sent", deltaKey: "offersDelta", icon: MailCheck, color: "text-emerald-600 bg-emerald-50" },
] as const;

export function RecruitmentAnalytics({ refreshKey }: { refreshKey: number }) {
  const { data, isLoading, error, refetch } = useDashboardSection("recruitment", refreshKey);

  return (
    <SectionCard>
      <SectionHeading title="Recruitment Analytics" subtitle="Applications, interviews, and offers" />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading || !data ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
          <Skeleton className="h-56 w-full" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SUMMARY_CARDS.map(({ key, label, deltaKey, icon: Icon, color }) => (
              <div key={key} className="rounded-lg border border-gray-100 p-3">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-2 text-lg font-semibold text-gray-900">{formatNumber(data.summary[key])}</p>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="mt-0.5 text-[11px] text-emerald-600">{data.summary[deltaKey]}</p>
              </div>
            ))}
            <div className="rounded-lg border border-gray-100 p-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Percent className="h-4 w-4" />
              </span>
              <p className="mt-2 text-lg font-semibold text-gray-900">{formatPercent(data.summary.hiringSuccessRate)}</p>
              <p className="text-xs text-gray-500">Hiring Success Rate</p>
            </div>
          </div>

          {data.trend.length === 0 ? (
            <EmptyState message="No hiring activity yet." />
          ) : (
            <ResponsiveContainer width="100%" height={260} className="mt-4">
              <BarChart data={data.trend} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #f3f4f6", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="applications" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="interviews" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="offers" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </SectionCard>
  );
}
