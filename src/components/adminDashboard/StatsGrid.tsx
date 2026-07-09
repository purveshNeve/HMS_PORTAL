// components/dashboard/StatsGrid.tsx
"use client";

import { useEffect } from "react";
import { useDashboardSection } from "@/lib/use-dashboard-section";
import type { StatCardData } from "@/types/admindashboard";
import { StatsCard, StatsCardSkeleton } from "./StatsCard";
import { ErrorState } from "./DashboardStates";

export function StatsGrid({ refreshKey, onLoaded }: { refreshKey: number; onLoaded?: (lastUpdated: string) => void }) {
  const { data, isLoading, error, refetch } = useDashboardSection("overview", refreshKey);

  useEffect(() => {
    if (data?.lastUpdated && onLoaded) onLoaded(data.lastUpdated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.lastUpdated]);

  if (error) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {isLoading || !data
        ? Array.from({ length: 8 }).map((_, i) => <StatsCardSkeleton key={i} />)
        : data.stats.map((stat: StatCardData, i: number) => <StatsCard key={stat.id} stat={stat} index={i} />)}
    </div>
  );
}
