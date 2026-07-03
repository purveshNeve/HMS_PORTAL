"use client";

import { useMemo } from "react";
import {
  Users, IndianRupee, TrendingUp, Home, Building2,
  Clock, AlertTriangle, CheckCircle2, CalendarClock,
} from "lucide-react";
import type { DashboardKPIs } from "./types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtCr = (n: number) => {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)} L`;
  return fmt(n);
};

interface Props {
  kpis: DashboardKPIs;
  totalEmployees: number;
}

interface KpiCard {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  warn?: boolean;
}

export default function EmployeeStatsCards({ kpis, totalEmployees }: Props) {
  const cards: KpiCard[] = useMemo(() => {
    const payrollReadinessPct =
      totalEmployees > 0 ? Math.round((kpis.payrollSubmitted / totalEmployees) * 100) : 0;

    return [
      {
        label: "Total Employees",
        value: String(kpis.totalEmployees),
        sub: "on active payroll",
        icon: <Users size={20} />,
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50 dark:bg-indigo-900/20",
      },
      {
        label: "Total Monthly Payroll",
        value: fmtCr(kpis.totalMonthlyPayroll),
        sub: `₹${fmtCr(kpis.totalAnnualCTC)} annual CTC`,
        icon: <IndianRupee size={20} />,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
      },
      {
        label: "Avg Monthly Salary",
        value: fmt(kpis.avgMonthlySalary),
        sub: `${fmtCr(kpis.avgMonthlySalary * 12)} per year`,
        icon: <TrendingUp size={20} />,
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-50 dark:bg-violet-900/20",
      },
      {
        label: "Avg Team Tenure",
        value: `${kpis.avgTenure} yrs`,
        sub: "average experience",
        icon: <Clock size={20} />,
        color: "text-sky-600 dark:text-sky-400",
        bg: "bg-sky-50 dark:bg-sky-900/20",
      },
      {
        label: "Remote / Office",
        value: `${kpis.remoteCount} / ${kpis.officeCount}`,
        sub: `${kpis.totalEmployees} total`,
        icon: kpis.remoteCount > kpis.officeCount ? <Home size={20} /> : <Building2 size={20} />,
        color: "text-teal-600 dark:text-teal-400",
        bg: "bg-teal-50 dark:bg-teal-900/20",
      },
      {
        label: "On Leave Today",
        value: String(kpis.onLeaveCount),
        sub: `${kpis.totalLeavesThisMonth} approved this month`,
        icon: <CalendarClock size={20} />,
        color: kpis.onLeaveCount > 0 ? "text-amber-600 dark:text-amber-400" : "text-zinc-500",
        bg: kpis.onLeaveCount > 0 ? "bg-amber-50 dark:bg-amber-900/20" : "bg-zinc-50 dark:bg-zinc-800/40",
        warn: kpis.onLeaveCount > 0,
      },
      {
        label: "Payroll Submitted",
        value: `${kpis.payrollSubmitted} / ${kpis.totalEmployees}`,
        sub: `${payrollReadinessPct}% ready`,
        icon: <CheckCircle2 size={20} />,
        color: kpis.payrollPending > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400",
        bg: kpis.payrollPending > 0 ? "bg-rose-50 dark:bg-rose-900/20" : "bg-emerald-50 dark:bg-emerald-900/20",
        warn: kpis.payrollPending > 0,
      },
      {
        label: "Incomplete Profiles",
        value: String(kpis.incompleteProfiles),
        sub: `${kpis.missingPhone} missing phone`,
        icon: <AlertTriangle size={20} />,
        color: kpis.incompleteProfiles > 0 ? "text-orange-600 dark:text-orange-400" : "text-emerald-600 dark:text-emerald-400",
        bg: kpis.incompleteProfiles > 0 ? "bg-orange-50 dark:bg-orange-900/20" : "bg-emerald-50 dark:bg-emerald-900/20",
        warn: kpis.incompleteProfiles > 0,
      },
    ];
  }, [kpis, totalEmployees]);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`relative overflow-hidden rounded-2xl border p-5 transition-shadow hover:shadow-md ${
            c.warn
              ? "border-amber-200 bg-white dark:border-amber-800/40 dark:bg-zinc-900"
              : "border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          }`}
        >
          {/* Decorative circle */}
          <div
            className={`absolute -right-5 -top-5 h-20 w-20 rounded-full opacity-10 ${c.bg}`}
          />
          <div className={`mb-3 inline-flex rounded-xl p-2.5 ${c.bg}`}>
            <span className={c.color}>{c.icon}</span>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
            {c.value}
          </p>
          <p className="mt-0.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            {c.label}
          </p>
          <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">{c.sub}</p>
          {c.warn && (
            <div className="absolute right-3 top-3 h-2 w-2 animate-pulse rounded-full bg-amber-400" />
          )}
        </div>
      ))}
    </div>
  );
}
