"use client";

import { useMemo } from "react";
import { CheckCircle2, AlertTriangle, Clock3, IndianRupee } from "lucide-react";
import type { DashboardKPIs, DashboardEmployee } from "./types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

interface Props {
  kpis: DashboardKPIs;
  employees: DashboardEmployee[];
}

export default function PayrollReadiness({ kpis, employees }: Props) {
  const readinessPct = useMemo(
    () =>
      employees.length > 0
        ? Math.round((kpis.payrollSubmitted / employees.length) * 100)
        : 0,
    [kpis, employees]
  );

  const pendingEmployees = useMemo(
    () => employees.filter((e) => e.payrollStatus === "PENDING").slice(0, 6),
    [employees]
  );

  const submittedEmployees = useMemo(
    () =>
      employees.filter((e) =>
        ["SUBMITTED", "PROCESSED", "PAID"].includes(e.payrollStatus)
      ).slice(0, 4),
    [employees]
  );

  const totalPendingValue = useMemo(
    () =>
      employees
        .filter((e) => e.payrollStatus === "PENDING")
        .reduce((s, e) => s + e.monthlySalary, 0),
    [employees]
  );

  const totalCredited = useMemo(
    () =>
      employees
        .filter((e) => ["SUBMITTED", "PROCESSED", "PAID"].includes(e.payrollStatus))
        .reduce((s, e) => s + e.monthlySalary, 0),
    [employees]
  );

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-1 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        Payroll Readiness
      </h2>
      <p className="mb-5 text-xs text-zinc-400">Salary submission status for current month</p>

      {/* Progress ring summary */}
      <div className="mb-6 flex items-center gap-6">
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
          <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={readinessPct === 100 ? "#10b981" : readinessPct >= 60 ? "#6366f1" : "#f59e0b"}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(readinessPct / 100) * 251.2} 251.2`}
            />
          </svg>
          <span className="absolute text-lg font-black text-zinc-800 dark:text-zinc-100">
            {readinessPct}%
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 flex-1">
          <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-900/20">
            <p className="text-xs text-zinc-400">Submitted</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {kpis.payrollSubmitted}
            </p>
            <p className="text-[11px] text-zinc-400">{fmt(totalCredited)}</p>
          </div>
          <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-900/20">
            <p className="text-xs text-zinc-400">Pending</p>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400">
              {kpis.payrollPending}
            </p>
            <p className="text-[11px] text-zinc-400">{fmt(totalPendingValue)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Pending */}
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <AlertTriangle size={13} className="text-amber-500" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Pending Submission
            </p>
          </div>
          {pendingEmployees.length === 0 ? (
            <p className="text-sm text-zinc-400">All payrolls submitted! ✅</p>
          ) : (
            <div className="space-y-2">
              {pendingEmployees.map((e) => (
                <div
                  key={e.userId}
                  className="flex items-center justify-between rounded-xl bg-amber-50/60 px-3 py-2 dark:bg-amber-900/10"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{e.name}</p>
                    <p className="text-[11px] text-zinc-400">{e.department}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                    <Clock3 size={11} />
                    {fmt(e.monthlySalary)}
                  </div>
                </div>
              ))}
              {kpis.payrollPending > 6 && (
                <p className="text-xs text-zinc-400">+{kpis.payrollPending - 6} more pending</p>
              )}
            </div>
          )}
        </div>

        {/* Submitted */}
        <div>
          <div className="mb-2 flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Recently Submitted
            </p>
          </div>
          {submittedEmployees.length === 0 ? (
            <p className="text-sm text-zinc-400">No payrolls submitted yet.</p>
          ) : (
            <div className="space-y-2">
              {submittedEmployees.map((e) => (
                <div
                  key={e.userId}
                  className="flex items-center justify-between rounded-xl bg-emerald-50/60 px-3 py-2 dark:bg-emerald-900/10"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{e.name}</p>
                    <p className="text-[11px] text-zinc-400">{e.payrollStatus}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    <IndianRupee size={11} />
                    {fmt(e.monthlySalary)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
