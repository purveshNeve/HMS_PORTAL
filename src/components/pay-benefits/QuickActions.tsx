"use client";
import {
  Download,
  FileText,
  Receipt,
  FilePen,
  History,
  MessageCircle,
} from "lucide-react";

const actions = [
  { label: "Download Latest Payslip", icon: Download, color: "bg-violet-600 hover:bg-violet-700 text-white" },
  { label: "Download Form 16", icon: FileText, color: "bg-indigo-600 hover:bg-indigo-700 text-white" },
  { label: "Submit Expense Claim", icon: Receipt, color: "bg-amber-500 hover:bg-amber-600 text-white" },
  { label: "Update Tax Declaration", icon: FilePen, color: "bg-blue-600 hover:bg-blue-700 text-white" },
  { label: "View Salary History", icon: History, color: "bg-teal-600 hover:bg-teal-700 text-white" },
  { label: "Contact Payroll Team", icon: MessageCircle, color: "bg-slate-700 hover:bg-slate-800 text-white" },
];

export default function QuickActions() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-600 to-slate-600" />
        <h2 className="text-lg font-semibold text-slate-800">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className={`${action.color} rounded-2xl p-4 flex flex-col items-start gap-3 text-left transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0`}
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold leading-tight">{action.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
