// components/dashboard/ActivityTimeline.tsx
"use client";

import {
  UserPlus, Building2, CalendarCheck, CalendarClock, Wallet, ClipboardCheck, LucideIcon,
} from "lucide-react";
import { useDashboardSection } from "@/lib/use-dashboard-section";
import { SectionCard, SectionHeading, Skeleton, ErrorState, EmptyState } from "./DashboardStates";
import { formatRelativeTime } from "@/lib/format";
import type { ActivityItem } from "@/types/admindashboard";

const TYPE_ICON: Record<ActivityItem["type"], LucideIcon> = {
  employee_added: UserPlus,
  department_created: Building2,
  leave_approved: CalendarCheck,
  interview_scheduled: CalendarClock,
  payroll_processed: Wallet,
  performance_review: ClipboardCheck,
};

const STATUS_DOT: Record<ActivityItem["status"], string> = {
  success: "bg-emerald-500",
  info: "bg-sky-500",
  warning: "bg-amber-500",
  pending: "bg-gray-400",
};

export function ActivityTimeline({ refreshKey }: { refreshKey: number }) {
  const { data, isLoading, error, refetch } = useDashboardSection("activities", refreshKey);

  return (
    <SectionCard>
      <SectionHeading title="Recent Activities" />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading || !data ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState message="No recent activity." />
      ) : (
        <ol className="relative space-y-5 border-l border-gray-100 pl-5">
          {data.map((item: ActivityItem) => {
            const Icon = TYPE_ICON[item.type];
            return (
              <li key={item.id} className="relative">
                <span className={`absolute -left-[27px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ${STATUS_DOT[item.status]}`}>
                  <Icon className="h-2.5 w-2.5 text-white" />
                </span>
                <p className="text-sm text-gray-800">
                  <span className="font-medium">{item.actor}</span> {item.description}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">{formatRelativeTime(item.timestamp)}</p>
              </li>
            );
          })}
        </ol>
      )}
    </SectionCard>
  );
}
