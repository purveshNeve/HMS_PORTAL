"use client";
import { salaryBreakdown } from "@/data/payBenefitsData";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export default function SalaryBreakdown() {
  const grossMonthly = salaryBreakdown.earnings.reduce((a, b) => a + b.monthly, 0);
  const grossAnnual = salaryBreakdown.earnings.reduce((a, b) => a + b.annual, 0);
  const deductionMonthly = salaryBreakdown.deductions.reduce((a, b) => a + b.monthly, 0);
  const deductionAnnual = salaryBreakdown.deductions.reduce((a, b) => a + b.annual, 0);

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-600 to-cyan-600" />
        <h2 className="text-lg font-semibold text-slate-800">Salary Breakdown</h2>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/2">
                  Component
                </th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Monthly
                </th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Annual
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Earnings header */}
              <tr className="bg-green-50">
                <td colSpan={3} className="px-6 py-2.5 text-xs font-bold text-green-700 uppercase tracking-wider">
                  Earnings
                </td>
              </tr>
              {salaryBreakdown.earnings.map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${
                    i % 2 === 0 ? "" : "bg-slate-50/30"
                  }`}
                >
                  <td className="px-6 py-3 text-sm text-slate-700">{row.label}</td>
                  <td className="px-6 py-3 text-sm text-right text-slate-800 font-medium">
                    {row.monthly === 0 ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      `₹${fmt(row.monthly)}`
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-slate-800 font-medium">
                    {row.annual === 0 ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      `₹${fmt(row.annual)}`
                    )}
                  </td>
                </tr>
              ))}
              {/* Gross Salary row */}
              <tr className="bg-green-50 border-t-2 border-green-200">
                <td className="px-6 py-3.5 text-sm font-bold text-green-800">Gross Salary</td>
                <td className="px-6 py-3.5 text-sm text-right font-bold text-green-800">
                  ₹{fmt(grossMonthly)}
                </td>
                <td className="px-6 py-3.5 text-sm text-right font-bold text-green-800">
                  ₹{fmt(grossAnnual)}
                </td>
              </tr>

              {/* Deductions header */}
              <tr className="bg-red-50">
                <td colSpan={3} className="px-6 py-2.5 text-xs font-bold text-red-700 uppercase tracking-wider">
                  Deductions
                </td>
              </tr>
              {salaryBreakdown.deductions.map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-b border-slate-50 hover:bg-red-50/40 transition-colors ${
                    i % 2 === 0 ? "" : "bg-slate-50/30"
                  }`}
                >
                  <td className="px-6 py-3 text-sm text-slate-700">{row.label}</td>
                  <td className="px-6 py-3 text-sm text-right text-red-600 font-medium">
                    − ₹{fmt(row.monthly)}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-red-600 font-medium">
                    − ₹{fmt(row.annual)}
                  </td>
                </tr>
              ))}
              {/* Total Deductions */}
              <tr className="bg-red-50 border-t-2 border-red-200">
                <td className="px-6 py-3.5 text-sm font-bold text-red-800">Total Deductions</td>
                <td className="px-6 py-3.5 text-sm text-right font-bold text-red-800">
                  − ₹{fmt(deductionMonthly)}
                </td>
                <td className="px-6 py-3.5 text-sm text-right font-bold text-red-800">
                  − ₹{fmt(deductionAnnual)}
                </td>
              </tr>

              {/* Net Salary */}
              <tr className="bg-gradient-to-r from-violet-50 to-blue-50 border-t-2 border-violet-200">
                <td className="px-6 py-4 text-base font-black text-violet-800">Net Salary</td>
                <td className="px-6 py-4 text-base text-right font-black text-violet-800">
                  ₹{fmt(grossMonthly - deductionMonthly)}
                </td>
                <td className="px-6 py-4 text-base text-right font-black text-violet-800">
                  ₹{fmt(grossAnnual - deductionAnnual)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
