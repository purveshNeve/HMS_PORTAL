// components/dashboard/DashboardHeader.tsx
"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import EmployeeQueriesButton from "@/components/chat/EmployeeQueriesButton";

interface DashboardHeaderProps {
  lastUpdated: string | null;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function DashboardHeader({ lastUpdated, onRefresh, isRefreshing }: DashboardHeaderProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Welcome back, Admin</h1>
        <p className="mt-1 text-sm text-gray-500">Here&apos;s an overview of your organization today.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">
            {now?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) ?? "—"}
          </p>
          <p className="text-xs text-gray-400">
            Last updated {lastUpdated ? new Date(lastUpdated).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—"}
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
        <EmployeeQueriesButton />
      </div>
    </motion.div>
  );
}
