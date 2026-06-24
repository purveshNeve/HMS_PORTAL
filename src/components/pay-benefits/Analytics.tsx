"use client";
import { salaryHistory, salaryBreakdown } from "@/data/payBenefitsData";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

const fmtL = (n: number) => `₹${(n / 100000).toFixed(1)}L`;

// Simple bar chart component
function BarChart({
  data,
  color,
}: {
  data: { label: string; value: number }[];
  color: string;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-2 h-28 mt-4">
      {data.map((d) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[10px] text-slate-500 font-medium">{fmtL(d.value)}</span>
            <div className="w-full rounded-t-lg transition-all duration-500" style={{ height: `${pct}%`, backgroundColor: color }} />
            <span className="text-[9px] text-slate-400 text-center leading-tight">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Donut segments for tax breakdown
function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((a, b) => a + b.value, 0);
  let cumPct = 0;
  const CIRC = 2 * Math.PI * 40;
  return (
    <div className="flex items-center gap-6 mt-4">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="16" />
        {segments.map((seg) => {
          const pct = seg.value / total;
          const offset = CIRC * (1 - cumPct);
          const dashArray = `${CIRC * pct} ${CIRC * (1 - pct)}`;
          const el = (
            <circle
              key={seg.label}
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={seg.color}
              strokeWidth="16"
              strokeDasharray={dashArray}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
            />
          );
          cumPct += pct;
          return el;
        })}
        <text x="50" y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#334155">
          {Math.round(100)}%
        </text>
      </svg>
      <div className="space-y-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-slate-600">{seg.label}</span>
            <span className="text-xs font-semibold text-slate-800 ml-auto">₹{fmt(seg.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const reimbHistogram = [
    { label: "Travel", value: 4500 },
    { label: "Internet", value: 999 },
    { label: "Training", value: 12000 },
    { label: "Medical", value: 3000 },
    { label: "Supplies", value: 1750 },
  ];

  const deductionSegments = [
    { label: "Provident Fund", value: 6000, color: "#7c3aed" },
    { label: "Income Tax (TDS)", value: 8500, color: "#2563eb" },
    { label: "Prof. Tax", value: 200, color: "#0891b2" },
    { label: "Insurance", value: 1200, color: "#059669" },
    { label: "Other", value: 300, color: "#d97706" },
  ];

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-600 to-violet-600" />
        <h2 className="text-lg font-semibold text-slate-800">Analytics</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Salary Growth */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:col-span-2">
          <p className="text-sm font-semibold text-slate-700">Salary Growth Over Time</p>
          <p className="text-xs text-slate-400 mt-0.5">Annual CTC progression</p>
          <BarChart data={salaryHistory.map((s) => ({ label: s.year.split(" ")[0], value: s.ctc }))} color="#7c3aed" />
        </div>

        {/* Reimbursement Usage */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-slate-700">Reimbursement Usage</p>
          <p className="text-xs text-slate-400 mt-0.5">By category (FY 2025-26)</p>
          <BarChart data={reimbHistogram} color="#f59e0b" />
        </div>

        {/* Tax Deduction Distribution */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-sm font-semibold text-slate-700">Tax Deduction Distribution</p>
          <p className="text-xs text-slate-400 mt-0.5">Monthly deductions breakdown</p>
          <DonutChart segments={deductionSegments} />
        </div>
      </div>
    </section>
  );
}
