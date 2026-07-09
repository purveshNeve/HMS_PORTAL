// components/dashboard/PerformanceSnapshot.tsx
"use client";

import { motion } from "framer-motion";
import { useDashboardSection } from "@/lib/use-dashboard-section";
import type { PerformanceMetric } from "@/types/admindashboard";
import { SectionCard, SectionHeading, Skeleton, ErrorState, EmptyState } from "./DashboardStates";

export function PerformanceSnapshot({ refreshKey }: { refreshKey: number }) {
  const { data, isLoading, error, refetch } = useDashboardSection("performance", refreshKey);

  return (
    <SectionCard>
      <SectionHeading title="Performance Snapshot" />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading || !data ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState message="No performance data yet." />
      ) : (
        <div className="space-y-4">
          {data.map((metric: PerformanceMetric) => (
            <div key={metric.id}>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-sm text-gray-700">{metric.label}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {metric.value}%{" "}
                  {metric.deltaLabel && <span className="font-normal text-emerald-600">{metric.deltaLabel}</span>}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
