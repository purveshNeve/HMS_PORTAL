"use client";

import { useMemo } from "react";
import { Crown, TrendingDown, Clock, Star, CalendarCheck, UserX } from "lucide-react";
import type { DashboardInsights, DashboardEmployee } from "./types";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

function avatarGrad(name: string) {
  const colors = [
    "from-violet-500 to-purple-700", "from-emerald-400 to-teal-600",
    "from-sky-400 to-blue-600", "from-rose-400 to-pink-600",
    "from-amber-400 to-orange-600", "from-indigo-400 to-blue-700",
  ];
  let h = 0;
  for (const c of name) h += c.charCodeAt(0);
  return colors[h % colors.length];
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function InsightSection({
  icon, title, color, children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-4 flex items-center gap-2">
        <span className={`rounded-lg p-1.5 ${color}`}>{icon}</span>
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function EmpRow({
  emp,
  badge,
}: {
  emp: DashboardEmployee;
  badge?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      {emp.profileImage ? (
        <img src={emp.profileImage} alt={emp.name} className="h-8 w-8 rounded-lg object-cover" />
      ) : (
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${avatarGrad(emp.name)} text-[10px] font-bold text-white`}
        >
          {initials(emp.name)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">{emp.name}</p>
        <p className="truncate text-[11px] text-zinc-400">{emp.designation || emp.role}</p>
      </div>
      {badge && (
        <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          {badge}
        </span>
      )}
    </div>
  );
}

function WarningRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-zinc-600 dark:text-zinc-300">{label}</span>
      <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
        {value}
      </span>
    </div>
  );
}

export default function TeamInsights({ insights }: { insights: DashboardInsights }) {
  const incompleteGroups = useMemo(() => {
    const missingPhone = insights.incompleteProfileEmployees.filter((e) => !e.hasPhone);
    const missingAddr = insights.incompleteProfileEmployees.filter((e) => !e.hasAddress);
    const missingEmergency = insights.incompleteProfileEmployees.filter((e) => !e.hasEmergencyContact);
    return { missingPhone, missingAddr, missingEmergency };
  }, [insights.incompleteProfileEmployees]);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {/* Highest Paid */}
      <InsightSection
        icon={<Crown size={16} className="text-amber-600" />}
        title="Highest Paid Employees"
        color="bg-amber-50 dark:bg-amber-900/20"
      >
        <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
          {insights.highestPaid.map((e) => (
            <EmpRow key={e.userId} emp={e} badge={fmt(e.monthlySalary) + "/mo"} />
          ))}
        </div>
      </InsightSection>

      {/* Lowest Paid */}
      <InsightSection
        icon={<TrendingDown size={16} className="text-rose-500" />}
        title="Lowest Paid Employees"
        color="bg-rose-50 dark:bg-rose-900/20"
      >
        <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
          {insights.lowestPaid.map((e) => (
            <EmpRow key={e.userId} emp={e} badge={fmt(e.monthlySalary) + "/mo"} />
          ))}
        </div>
      </InsightSection>

      {/* Longest Tenure */}
      <InsightSection
        icon={<Clock size={16} className="text-sky-600" />}
        title="Longest Serving Employees"
        color="bg-sky-50 dark:bg-sky-900/20"
      >
        <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
          {insights.longestTenure.map((e) => (
            <EmpRow key={e.userId} emp={e} badge={`${e.tenureYears.toFixed(1)} yrs`} />
          ))}
        </div>
      </InsightSection>

      {/* Recently Joined */}
      <InsightSection
        icon={<Star size={16} className="text-violet-600" />}
        title="Recently Joined (Last 60 Days)"
        color="bg-violet-50 dark:bg-violet-900/20"
      >
        {insights.recentlyJoined.length === 0 ? (
          <p className="text-sm text-zinc-400">No new employees in the last 60 days.</p>
        ) : (
          <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
            {insights.recentlyJoined.map((e) => (
              <EmpRow key={e.userId} emp={e} badge={fmtDate(e.joiningDate)} />
            ))}
          </div>
        )}
      </InsightSection>

      {/* Upcoming Anniversaries */}
      <InsightSection
        icon={<CalendarCheck size={16} className="text-teal-600" />}
        title="Upcoming Work Anniversaries"
        color="bg-teal-50 dark:bg-teal-900/20"
      >
        {insights.upcomingAnniversaries.length === 0 ? (
          <p className="text-sm text-zinc-400">No anniversaries in the next 30 days.</p>
        ) : (
          <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
            {insights.upcomingAnniversaries.map((e) => (
              <EmpRow
                key={e.userId}
                emp={e}
                badge={e.daysToAnniversary === 0 ? "Today! 🎉" : `in ${e.daysToAnniversary}d`}
              />
            ))}
          </div>
        )}
      </InsightSection>

      {/* Profile Completeness */}
      <InsightSection
        icon={<UserX size={16} className="text-orange-600" />}
        title="Profile Gaps"
        color="bg-orange-50 dark:bg-orange-900/20"
      >
        {insights.incompleteProfileEmployees.length === 0 ? (
          <p className="text-sm text-zinc-400 flex items-center gap-1">
            ✅ All employee profiles are complete.
          </p>
        ) : (
          <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
            <WarningRow label="Missing Phone" value={String(incompleteGroups.missingPhone.length)} />
            <WarningRow label="Missing Address" value={String(incompleteGroups.missingAddr.length)} />
            <WarningRow label="Missing Emergency Contact" value={String(incompleteGroups.missingEmergency.length)} />
            <div className="pt-2">
              <p className="mb-2 text-[11px] uppercase tracking-widest text-zinc-400">
                Employees with gaps
              </p>
              {insights.incompleteProfileEmployees.slice(0, 4).map((e) => (
                <EmpRow key={e.userId} emp={e} />
              ))}
            </div>
          </div>
        )}
      </InsightSection>
    </div>
  );
}
