"use client";
import { useState } from "react";
import { payslips } from "@/data/payBenefitsData";
import { Download, Eye, Search } from "lucide-react";

const years = [...new Set(payslips.map((p) => p.year))].sort((a, b) => b - a);

export default function Payslips() {
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = payslips.filter((p) => {
    const yearMatch = selectedYear === "all" || p.year === selectedYear;
    const searchMatch =
      search === "" ||
      p.month.toLowerCase().includes(search.toLowerCase()) ||
      p.year.toString().includes(search);
    return yearMatch && searchMatch;
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-600 to-teal-600" />
          <h2 className="text-lg font-semibold text-slate-800">Payslips</h2>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by month or year…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white"
          />
        </div>
        <select
          value={selectedYear}
          onChange={(e) =>
            setSelectedYear(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white text-slate-700"
        >
          <option value="all">All Years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Month</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Year</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Credited Date</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-sm">
                    No payslips found for the selected filters.
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`border-b border-slate-50 hover:bg-violet-50/30 transition-colors ${
                      i % 2 === 0 ? "" : "bg-slate-50/20"
                    }`}
                  >
                    <td className="px-6 py-3.5 text-sm font-medium text-slate-700">{p.month}</td>
                    <td className="px-6 py-3.5 text-sm text-slate-600">{p.year}</td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-slate-600">
                      {new Date(p.creditedDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors">
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors">
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
