// components/dashboard/NotificationsPanel.tsx
"use client";

import { Bell } from "lucide-react";
import { useDashboardSection } from "@/lib/use-dashboard-section";
import { SectionCard, SectionHeading, Skeleton, ErrorState, EmptyState } from "./DashboardStates";
import type { NotificationItem } from "@/types/admindashboard";

const SEVERITY_STYLES: Record<NotificationItem["severity"], string> = {
  info: "bg-sky-50 text-sky-700",
  warning: "bg-amber-50 text-amber-700",
  critical: "bg-rose-50 text-rose-700",
};

export function NotificationsPanel({ refreshKey }: { refreshKey: number }) {
  const { data, isLoading, error, refetch } = useDashboardSection("notifications", refreshKey);

  return (
    <SectionCard>
      <SectionHeading title="Notifications" action={<Bell className="h-4 w-4 text-gray-400" />} />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState message="You're all caught up." />
      ) : (
        <ul className="space-y-1.5">
          {data.map((n: NotificationItem) => (
            <li key={n.id} className="flex items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-gray-50">
              <span className="text-gray-700">{n.label}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${SEVERITY_STYLES[n.severity]}`}>{n.count}</span>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
