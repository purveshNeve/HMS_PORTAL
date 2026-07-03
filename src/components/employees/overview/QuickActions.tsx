"use client";

import {
  Download, FileText, Users, TrendingUp, Calendar, BarChart2,
} from "lucide-react";

const actions = [
  {
    label: "Export Team Report",
    icon: <Download size={16} />,
    color: "bg-indigo-600 hover:bg-indigo-700 text-white",
    onClick: () => window.print(),
  },
  {
    label: "Download Salary Summary",
    icon: <FileText size={16} />,
    color: "bg-emerald-600 hover:bg-emerald-700 text-white",
    onClick: () => window.print(),
  },
  {
    label: "View Employee Directory",
    icon: <Users size={16} />,
    color: "bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700",
    onClick: () => (window.location.href = "/admin/Employees"),
  },
  {
    label: "Initiate Salary Revision",
    icon: <TrendingUp size={16} />,
    color: "bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700",
    onClick: () => (window.location.href = "/admin/Employees/Salary"),
  },
  {
    label: "Schedule Reviews",
    icon: <Calendar size={16} />,
    color: "bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700",
    onClick: () => {},
  },
  {
    label: "Bulk Compensation Update",
    icon: <BarChart2 size={16} />,
    color: "bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700",
    onClick: () => {},
  },
];

export default function QuickActions() {
  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-4 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            className={`flex flex-col items-center gap-2 rounded-xl px-3 py-3.5 text-xs font-medium transition-all active:scale-[0.97] ${a.color}`}
          >
            {a.icon}
            <span className="text-center leading-tight">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
