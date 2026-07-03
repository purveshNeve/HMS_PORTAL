"use client";

import { useMemo } from "react";
import { CalendarX, Home, Users, TrendingDown, CheckCircle2 } from "lucide-react";
import type { DashboardKPIs, DashboardEmployee } from "./types";

interface Props {
  kpis: DashboardKPIs;
  employees: DashboardEmployee[];
}

export default function AttendanceOverview({ kpis, employees }: Props) {
  const onLeaveEmployees = useMemo(
    () => employees.filter((e) => e.onLeave),
    [employees]
  );

  const highAbsentees = useMemo(
    () =>
      employees
        .filter((e) => e.leavesThisMonth >= 2)
        .sort((a, b) => b.leavesThisMonth - a.leavesThisMonth)
        .slice(0, 5),
    [employees]
  );

  const topWFH = useMemo(
    () =>
      employees
        .filter((e) => e.wfhThisMonth > 0)
        .sort((a, b) => b.wfhThisMonth - a.wfhThisMonth)
        .slice(0, 5),
    [employees]
  );

  const attendancePct = useMemo(() => {
    if (!employees.length) return 0;
    const avgLeaves = kpis.totalLeavesThisMonth / employees.length;
    const workingDays = 22;
    return Math.max(0, Math.min(100, Math.round(((workingDays - avgLeaves) / workingDays) * 100)));
  }, [employees, kpis]);

  const statBoxes = [
    {
      label: "On Leave Today",
      value: kpis.onLeaveCount,
      icon: <CalendarX size={18} />,
      color: "text-rose-600",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      label: "WFH This Month",
      value: kpis.totalWFHThisMonth,
      icon: <Home size={18} />,
      color: "text-sky-600",
      bg: "bg-sky-50 dark:bg-sky-900/20",
    },
    {
      label: "Total Leaves Approved",
      value: kpis.totalLeavesThisMonth,
      icon: <CheckCircle2 size={18} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "High Absenteeism (≥2)",
      value: highAbsentees.length,
      icon: <TrendingDown size={18} />,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        Attendance &amp; Leave Overview
      </h2>
      <p className="mb-5 text-xs text-zinc-400">Current month statistics</p>

      {/* Stat boxes */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statBoxes.map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.bg}`}>
            <span className={`mx-auto mb-1 block ${s.color}`}>{s.icon}</span>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Attendance bar */}
      <div className="mb-6">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-zinc-500">Est. Avg Attendance</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-100">{attendancePct}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              attendancePct >= 90 ? "bg-emerald-500" : attendancePct >= 75 ? "bg-amber-400" : "bg-rose-500"
            }`}
            style={{ width: `${attendancePct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* On Leave Now */}
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            On Leave Today
          </p>
          {onLeaveEmployees.length === 0 ? (
            <p className="text-sm text-zinc-400">Nobody on leave today 🎉</p>
          ) : (
            <div className="space-y-1.5">
              {onLeaveEmployees.slice(0, 4).map((e) => (
                <div key={e.userId} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-rose-400" />
                  <p className="text-sm text-zinc-700 dark:text-zinc-200">{e.name}</p>
                </div>
              ))}
              {onLeaveEmployees.length > 4 && (
                <p className="text-xs text-zinc-400">+{onLeaveEmployees.length - 4} more</p>
              )}
            </div>
          )}
        </div>

        {/* High Absenteeism */}
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            High Absenteeism
          </p>
          {highAbsentees.length === 0 ? (
            <p className="text-sm text-zinc-400">No excessive absenteeism this month.</p>
          ) : (
            <div className="space-y-1.5">
              {highAbsentees.map((e) => (
                <div key={e.userId} className="flex items-center justify-between">
                  <p className="text-sm text-zinc-700 dark:text-zinc-200">{e.name}</p>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    {e.leavesThisMonth}d
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top WFH */}
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            <Users size={11} className="inline mr-1" />Top WFH
          </p>
          {topWFH.length === 0 ? (
            <p className="text-sm text-zinc-400">No WFH approvals this month.</p>
          ) : (
            <div className="space-y-1.5">
              {topWFH.map((e) => (
                <div key={e.userId} className="flex items-center justify-between">
                  <p className="text-sm text-zinc-700 dark:text-zinc-200">{e.name}</p>
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                    {e.wfhThisMonth}d
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
