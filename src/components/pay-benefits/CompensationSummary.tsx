"use client";
import { compensationSummary } from "@/data/payBenefitsData";
import {
  IndianRupee,
  Calendar,
  Briefcase,
  TrendingUp,
  Award,
  CheckCircle2,
} from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

const cards = [
  {
    label: "Current Monthly Salary",
    value: `₹${fmt(compensationSummary.currentMonthlySalary)}`,
    icon: IndianRupee,
    accent: "from-violet-600 to-violet-400",
    bg: "bg-violet-50",
    iconBg: "bg-violet-600",
  },
  {
    label: "Annual CTC",
    value: `₹${fmt(compensationSummary.annualCTC)}`,
    icon: TrendingUp,
    accent: "from-blue-600 to-blue-400",
    bg: "bg-blue-50",
    iconBg: "bg-blue-600",
  },
  {
    label: "Base Salary (Annual)",
    value: `₹${fmt(compensationSummary.baseSalary)}`,
    icon: IndianRupee,
    accent: "from-cyan-600 to-cyan-400",
    bg: "bg-cyan-50",
    iconBg: "bg-cyan-600",
  },
  {
    label: "Variable Pay / Bonus",
    value: `₹${fmt(compensationSummary.variablePay)}`,
    icon: Award,
    accent: "from-amber-500 to-amber-400",
    bg: "bg-amber-50",
    iconBg: "bg-amber-500",
  },
  {
    label: "Last Salary Credited",
    value: new Date(compensationSummary.lastSalaryCreditedDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    icon: Calendar,
    accent: "from-emerald-600 to-emerald-400",
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-600",
  },
  {
    label: "Next Salary Credit",
    value: new Date(compensationSummary.nextSalaryCreditDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    icon: Calendar,
    accent: "from-teal-600 to-teal-400",
    bg: "bg-teal-50",
    iconBg: "bg-teal-600",
  },
  {
    label: "Salary Revision Date",
    value: new Date(compensationSummary.salaryRevisionDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    icon: Calendar,
    accent: "from-indigo-600 to-indigo-400",
    bg: "bg-indigo-50",
    iconBg: "bg-indigo-600",
  },
  {
    label: "Employment Type",
    value: compensationSummary.employmentType,
    icon: Briefcase,
    accent: "from-slate-600 to-slate-400",
    bg: "bg-slate-50",
    iconBg: "bg-slate-600",
  },
  {
    label: "Grade / Band",
    value: compensationSummary.grade,
    icon: Award,
    accent: "from-rose-600 to-rose-400",
    bg: "bg-rose-50",
    iconBg: "bg-rose-600",
  },
  {
    label: "Payroll Status",
    value: compensationSummary.payrollStatus,
    icon: CheckCircle2,
    accent: "from-green-600 to-green-400",
    bg: "bg-green-50",
    iconBg: "bg-green-600",
    isStatus: true,
  },
];

export default function CompensationSummary() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-600 to-blue-600" />
        <h2 className="text-lg font-semibold text-slate-800">Compensation Summary</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`${card.bg} rounded-2xl p-4 border border-white shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-3`}
            >
              <div className={`w-9 h-9 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium leading-tight mb-1">{card.label}</p>
                {card.isStatus ? (
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-green-700">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {card.value}
                  </span>
                ) : (
                  <p className="text-sm font-bold text-slate-800 leading-tight">{card.value}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
