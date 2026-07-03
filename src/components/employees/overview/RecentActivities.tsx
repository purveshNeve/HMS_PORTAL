"use client";

import { useMemo } from "react";
import type { DashboardEmployee } from "./types";

interface ActivityItem {
  id: string;
  type: "joined" | "leave" | "wfh" | "payroll" | "anniversary";
  name: string;
  detail: string;
  time: string;
  color: string;
  dot: string;
}

function formatAgo(date: Date): string {
  const ms = Date.now() - date.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

interface Props {
  employees: DashboardEmployee[];
}

export default function RecentActivities({ employees }: Props) {
  const activities = useMemo<ActivityItem[]>(() => {
    const items: ActivityItem[] = [];
    const now = new Date();

    employees.forEach((e) => {
      // New joiners (within 60 days)
      if (e.joiningDate) {
        const joined = new Date(e.joiningDate);
        const diffDays = (now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays >= 0 && diffDays <= 60) {
          items.push({
            id: `joined-${e.userId}`,
            type: "joined",
            name: e.name,
            detail: `Joined as ${e.designation || e.role} · ${e.department}`,
            time: formatAgo(joined),
            color: "text-emerald-700 dark:text-emerald-300",
            dot: "bg-emerald-500",
          });
        }
      }

      // On leave today
      if (e.onLeave) {
        items.push({
          id: `leave-${e.userId}`,
          type: "leave",
          name: e.name,
          detail: "Leave approved and currently active",
          time: "Today",
          color: "text-rose-600 dark:text-rose-400",
          dot: "bg-rose-400",
        });
      }

      // Payroll submitted
      if (["SUBMITTED", "PROCESSED", "PAID"].includes(e.payrollStatus)) {
        items.push({
          id: `payroll-${e.userId}`,
          type: "payroll",
          name: e.name,
          detail: `Payroll ${e.payrollStatus.toLowerCase()} for this month`,
          time: "This month",
          color: "text-indigo-700 dark:text-indigo-300",
          dot: "bg-indigo-500",
        });
      }

      // Upcoming anniversary within 7 days
      if (e.daysToAnniversary !== null && e.daysToAnniversary >= 0 && e.daysToAnniversary <= 7) {
        items.push({
          id: `anniversary-${e.userId}`,
          type: "anniversary",
          name: e.name,
          detail: `Work anniversary ${e.daysToAnniversary === 0 ? "is today! 🎉" : `in ${e.daysToAnniversary} day(s)`} · ${Math.round(e.tenureYears)} yr${Math.round(e.tenureYears) !== 1 ? "s" : ""}`,
          time: e.daysToAnniversary === 0 ? "Today" : `In ${e.daysToAnniversary}d`,
          color: "text-amber-700 dark:text-amber-300",
          dot: "bg-amber-400",
        });
      }
    });

    // Sort: payroll last, joined & anniversary first, leaves second
    const order = { joined: 0, anniversary: 1, leave: 2, wfh: 3, payroll: 4 };
    return items.sort((a, b) => order[a.type] - order[b.type]).slice(0, 12);
  }, [employees]);

  const typeLabel: Record<ActivityItem["type"], string> = {
    joined: "New Join",
    leave: "On Leave",
    wfh: "WFH",
    payroll: "Payroll",
    anniversary: "Anniversary",
  };

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        Recent Team Activities
      </h2>
      <p className="mb-5 text-xs text-zinc-400">Live events derived from employee records</p>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center py-8 text-zinc-400">
          <p className="text-sm">No recent activities to show.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-0 h-full w-px bg-zinc-100 dark:bg-zinc-800" />

          <div className="space-y-5">
            {activities.map((a) => (
              <div key={a.id} className="relative flex gap-4 pl-6">
                {/* Dot */}
                <div
                  className={`absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-900 ${a.dot}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                      {a.name}
                    </span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${a.color} bg-zinc-50 dark:bg-zinc-800`}
                    >
                      {typeLabel[a.type]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{a.detail}</p>
                </div>
                <span className="shrink-0 text-[11px] text-zinc-400">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
