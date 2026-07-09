// components/dashboard/DashboardFooter.tsx
"use client";

import { Database, HardDrive, Server, Wifi, Tag } from "lucide-react";
import { useDashboardSection } from "@/lib/use-dashboard-section";
import { Skeleton, ErrorState } from "./DashboardStates";
import { formatNumber, formatRelativeTime } from "@/lib/format";
import type { SystemStatusInfo } from "@/types/admindashboard";

const STATUS_DOT: Record<SystemStatusInfo["serverStatus"], string> = {
  operational: "bg-emerald-500",
  degraded: "bg-amber-500",
  down: "bg-rose-500",
};

export function DashboardFooter({ refreshKey }: { refreshKey: number }) {
  const { data, isLoading, error, refetch } = useDashboardSection("system", refreshKey);

  if (error) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  interface FooterItem {
    label: string;
    value: string;
    icon: typeof Database;
    dot?: string;
  }

  const items: FooterItem[] = [
    { label: "Total Records", value: formatNumber(data.totalRecords), icon: Database },
    { label: "Last Backup", value: formatRelativeTime(data.lastBackup), icon: HardDrive },
    { label: "Server Status", value: data.serverStatus, icon: Server, dot: STATUS_DOT[data.serverStatus as SystemStatusInfo["serverStatus"]] },
    { label: "API Status", value: data.apiStatus, icon: Wifi, dot: STATUS_DOT[data.apiStatus as SystemStatusInfo["serverStatus"]] },
    { label: "System Version", value: data.version, icon: Tag },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-1.5 text-gray-400">
            <item.icon className="h-3.5 w-3.5" />
            <span className="text-[11px]">{item.label}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            {item.dot && <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />}
            <span className="text-sm font-semibold capitalize text-gray-900">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
