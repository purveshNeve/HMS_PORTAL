// components/dashboard/UpcomingEvents.tsx
"use client";

import { Cake, Award, Video, Users2, PartyPopper, LucideIcon } from "lucide-react";
import { useDashboardSection } from "@/lib/use-dashboard-section";
import { SectionCard, SectionHeading, Skeleton, ErrorState, EmptyState } from "./DashboardStates";
import { formatDate } from "@/lib/format";
import type { UpcomingEvent } from "@/types/admindashboard";

const CATEGORY_META: Record<UpcomingEvent["category"], { label: string; icon: LucideIcon; color: string }> = {
  birthday: { label: "Birthday", icon: Cake, color: "text-rose-600 bg-rose-50" },
  anniversary: { label: "Work Anniversary", icon: Award, color: "text-amber-600 bg-amber-50" },
  interview: { label: "Interview", icon: Video, color: "text-sky-600 bg-sky-50" },
  meeting: { label: "Meeting", icon: Users2, color: "text-indigo-600 bg-indigo-50" },
  company_event: { label: "Company Event", icon: PartyPopper, color: "text-emerald-600 bg-emerald-50" },
};

export function UpcomingEvents({ refreshKey }: { refreshKey: number }) {
  const { data, isLoading, error, refetch } = useDashboardSection("events", refreshKey);

  return (
    <SectionCard>
      <SectionHeading title="Upcoming Events" />

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading || !data ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState message="Nothing on the calendar right now." />
      ) : (
        <div className="space-y-2">
          {data.map((event: UpcomingEvent) => {
            const meta = CATEGORY_META[event.category as UpcomingEvent["category"]];
            const Icon = meta.icon;
            return (
              <div key={event.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.color}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-400">{meta.label}{event.subtitle ? ` · ${event.subtitle}` : ""}</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-gray-500">{formatDate(event.date)}</span>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
