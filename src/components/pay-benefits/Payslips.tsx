"use client";

import { useEffect, useState, useCallback } from "react";
import { Download, Eye, Search, RefreshCw, AlertCircle, Clock } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PayslipRecord {
  _id: string;
  employeeId: string;
  month: string; // "YYYY-MM"
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  pf: number;
  tax: number;
  professionalTax: number;
  lopDeduction: number;
  lopDays: number;
  totalLeaveDays: number;
  totalWFHDays: number;
  workingDays: number;
  status: "PENDING" | "SUBMITTED" | "PROCESSED" | "PAID";
  submittedAt: string | null;
  creditedDate: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function parseMonth(m: string) {
  const [y, mon] = m.split("-").map(Number);
  return { label: `${MONTHS[mon - 1]} ${y}`, year: y, month: mon };
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (d: string | null | undefined) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

function StatusBadge({ status }: { status: PayslipRecord["status"] }) {
  const map: Record<
    PayslipRecord["status"],
    { label: string; dot: string; bg: string; text: string }
  > = {
    PENDING: {
      label: "Pending",
      dot: "bg-amber-400",
      bg: "bg-amber-50",
      text: "text-amber-700",
    },
    SUBMITTED: {
      label: "Submitted",
      dot: "bg-blue-400",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    PROCESSED: {
      label: "Processed",
      dot: "bg-violet-400",
      bg: "bg-violet-50",
      text: "text-violet-700",
    },
    PAID: {
      label: "Credited",
      dot: "bg-green-500",
      bg: "bg-green-100",
      text: "text-green-700",
    },
  };
  const c = map[status] ?? map.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.bg} ${c.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── Detail Drawer ─────────────────────────────────────────────────────────────

function PayslipDetail({
  record,
  onClose,
}: {
  record: PayslipRecord;
  onClose: () => void;
}) {
  const { label } = parseMonth(record.month);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const rows: { label: string; value: string; deduction?: boolean; net?: boolean }[] = [
    { label: "Gross Salary", value: fmt(record.grossSalary) },
    { label: "Provident Fund (PF) – 12%", value: `− ${fmt(record.pf)}`, deduction: true },
    { label: "TDS – 10%", value: `− ${fmt(record.tax)}`, deduction: true },
    { label: "Professional Tax", value: `− ${fmt(record.professionalTax)}`, deduction: true },
    ...(record.lopDeduction > 0
      ? [{ label: `LOP Deduction (${record.lopDays} days)`, value: `− ${fmt(record.lopDeduction)}`, deduction: true }]
      : []),
    { label: "Total Deductions", value: `− ${fmt(record.totalDeductions)}`, deduction: true },
    { label: "Net Salary (Take-home)", value: fmt(record.netSalary), net: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-zinc-900 sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-zinc-800">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-zinc-100">{label} Payslip</h3>
            <p className="mt-0.5 text-xs text-slate-400">
              {record.workingDays} working days · {record.totalLeaveDays} leave · {record.totalWFHDays} WFH
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          {rows.map((r) => (
            <div
              key={r.label}
              className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                r.net
                  ? "bg-violet-50 dark:bg-violet-900/20"
                  : r.deduction
                  ? ""
                  : "bg-slate-50 dark:bg-zinc-800/50"
              }`}
            >
              <span
                className={`text-sm ${
                  r.net
                    ? "font-bold text-violet-700 dark:text-violet-300"
                    : "text-slate-600 dark:text-zinc-300"
                }`}
              >
                {r.label}
              </span>
              <span
                className={`text-sm font-semibold ${
                  r.net
                    ? "text-violet-700 dark:text-violet-300"
                    : r.deduction
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-slate-800 dark:text-zinc-100"
                }`}
              >
                {r.value}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Credit date: {fmtDate(record.creditedDate)}</span>
            <StatusBadge status={record.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function Payslips({ initialOpenId, initialAction }: { initialOpenId?: string; initialAction?: string }) {
  const [payslips, setPayslips] = useState<PayslipRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [viewRecord, setViewRecord] = useState<PayslipRecord | null>(null);

  // Fetch only SUBMITTED / PROCESSED / PAID (i.e. accepted by admin)
  const fetchPayslips = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payroll/payslips?status=SUBMITTED,PROCESSED,PAID", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorBody}`);
      }
      const data = await res.json();
      setPayslips(data.payslips ?? []);
    } catch (e) {
      if (!silent) setError(e instanceof Error ? e.message : "Failed to fetch payslips");
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  // If an initial open id was provided, open that record once we have data
  useEffect(() => {
    if (initialOpenId && payslips.length > 0) {
      const match = payslips.find((p) => p._id === initialOpenId);
      if (match) setViewRecord(match);
    }
  }, [initialOpenId, payslips]);

  // If initialAction is 'download', trigger print for the opened record
  useEffect(() => {
    if (initialAction === "download" && viewRecord) {
      // give the modal a moment to render
      setTimeout(() => {
        try {
          window.print();
        } catch (e) {
          console.error("Print failed:", e);
        }
      }, 250);
    }
  }, [initialAction, viewRecord]);

  // Polling every 30 seconds (silent background refresh)
  useEffect(() => {
    const id = setInterval(() => fetchPayslips(true), 30_000);
    return () => clearInterval(id);
  }, [fetchPayslips]);

  const years = [...new Set(payslips.map((p) => parseMonth(p.month).year))].sort((a, b) => b - a);

  const filtered = payslips.filter((p) => {
    const { label, year } = parseMonth(p.month);
    const yearMatch = selectedYear === "all" || year === selectedYear;
    const searchMatch =
      search === "" ||
      label.toLowerCase().includes(search.toLowerCase()) ||
      String(year).includes(search);
    return yearMatch && searchMatch;
  });

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-600 to-teal-600" />
          <h2 className="text-lg font-semibold text-slate-800">Payslips</h2>
          {loading && <RefreshCw size={14} className="animate-spin text-slate-400" />}
        </div>
        <button
          onClick={() => fetchPayslips()}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
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

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 mb-4">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Month</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Net</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Credited Date</th>
                <th className="text-right px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 animate-pulse rounded bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Clock size={28} />
                      <p className="text-sm">
                        {payslips.length === 0
                          ? "No payslips processed yet. They will appear here once the admin submits your salary."
                          : "No payslips match your filters."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => {
                  const { label } = parseMonth(p.month);
                  return (
                    <tr
                      key={p._id}
                      className={`border-b border-slate-50 hover:bg-violet-50/30 transition-colors ${
                        i % 2 === 0 ? "" : "bg-slate-50/20"
                      }`}
                    >
                      <td className="px-6 py-3.5 text-sm font-medium text-slate-700">{label}</td>
                      <td className="px-6 py-3.5 text-sm text-slate-600">{fmt(p.grossSalary)}</td>
                      <td className="px-6 py-3.5 text-sm font-semibold text-violet-700">{fmt(p.netSalary)}</td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-6 py-3.5 text-sm text-slate-600">{fmtDate(p.creditedDate)}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewRecord(p)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" /> PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {viewRecord && (
        <PayslipDetail record={viewRecord} onClose={() => setViewRecord(null)} />
      )}
    </section>
  );
}
