// components/dashboard/OrganizationHealth.tsx
"use client";

import { useDashboardSection } from "@/lib/use-dashboard-section";
import { SectionCard, SectionHeading, Skeleton, ErrorState, EmptyState } from "./DashboardStates";
import type { OrgHealthMetric } from "@/types/admindashboard";

const STATUS_STYLES: Record<OrgHealthMetric["status"], { ring: string; badge: string; label: string }> = {
  good: { ring: "#10b981", badge: "bg-emerald-50 text-emerald-700", label: "Healthy" },
  warning: { ring: "#f59e0b", badge: "bg-amber-50 text-amber-700", label: "Needs Attention" },
  critical: { ring: "#f43f5e", badge: "bg-rose-50 text-rose-700", label: "Critical" },
};

function ProgressRing({ value, color }: { value: number; color: string }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width="64" height="64" viewBox="0 0 64 64" className="shrink-0 -rotate-90">
      <circle cx="32" cy="32" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="6" />
      <circle
        cx="32"
        cy="32"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.7s ease" }}
      />
    </svg>
  );
}

export function OrganizationHealth({ refreshKey }: { refreshKey: number }) {
  const { data, isLoading, error, refetch } = useDashboardSection("orgHealth", refreshKey);

  return (
    <SectionCard>
      <SectionHeading title="Organization Health" />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading || !data ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState message="No organization health data yet." />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {data.map((metric: OrgHealthMetric) => {
            const style = STATUS_STYLES[metric.status as OrgHealthMetric["status"]];
            return (
              <div key={metric.id} className="flex flex-col items-center gap-2 rounded-lg border border-gray-100 p-3 text-center">
                <div className="relative flex items-center justify-center">
                  <ProgressRing value={metric.value} color={style.ring} />
                  <span className="absolute text-sm font-semibold text-gray-900">{metric.value}%</span>
                </div>
                <p className="text-xs text-gray-600">{metric.label}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${style.badge}`}>{style.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
