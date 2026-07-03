"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  X,
  User,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingDown,
  Wallet,
  Home,
  Clock,
  Search,
  ChevronDown,
  IndianRupee,
  ShieldCheck,
  Receipt,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeaveRecord {
  requestId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  isHalfDay: boolean;
  calculatedDays: number;
}

interface WFHRecord {
  requestId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  calculatedDays: number;
}

interface EmployeePayroll {
  userId: string;
  name: string;
  email: string;
  role: string;
  department: string;
  designation: string;
  employmentType: string;
  workLocation: string;
  joiningDate: string | null;
  profileImage: string | null;
  manager: string;
  phone: string;
  gender: string;
  dateOfBirth: string | null;
  address: string;
  // salary
  grossSalary: number;
  workingDays: number;
  totalLeaveDays: number;
  totalWFHDays: number;
  lopDays: number;
  lopDeduction: number;
  pf: number;
  tax: number;
  professionalTax: number;
  totalDeductions: number;
  netSalary: number;
  // payroll submission
  payrollStatus: "PENDING" | "SUBMITTED" | "PROCESSED" | "PAID";
  submittedAt: string | null;
  creditedDate: string | null;
  // records
  leaves: LeaveRecord[];
  wfhRequests: WFHRecord[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

const fmtDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function roleColor(role: string) {
  if (role === "MANAGER") return "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300";
  if (role === "ADMIN") return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
  return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
}

function avatarGradient(name: string) {
  const colors = [
    "from-violet-500 to-purple-700",
    "from-emerald-400 to-teal-600",
    "from-sky-400 to-blue-600",
    "from-rose-400 to-pink-600",
    "from-amber-400 to-orange-600",
    "from-indigo-400 to-blue-700",
  ];
  let hash = 0;
  for (const c of name) hash += c.charCodeAt(0);
  return colors[hash % colors.length];
}

function netRatio(net: number, gross: number) {
  return gross > 0 ? Math.round((net / gross) * 100) : 0;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─── Employee Card ─────────────────────────────────────────────────────────────

function EmployeeCard({
  emp,
  onClick,
}: {
  emp: EmployeePayroll;
  onClick: () => void;
}) {
  const ratio = netRatio(emp.netSalary, emp.grossSalary);
  const grad = avatarGradient(emp.name);

  return (
    <button
      onClick={onClick}
      className="group relative flex w-full flex-col gap-4 rounded-2xl border border-zinc-200/70 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-zinc-700/60 dark:bg-zinc-900 dark:hover:border-indigo-500"
    >
      {/* Top row */}
      <div className="flex items-start gap-3">
        {emp.profileImage ? (
          <img
            src={emp.profileImage}
            alt={emp.name}
            className="h-12 w-12 rounded-xl object-cover ring-2 ring-white dark:ring-zinc-800"
          />
        ) : (
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-sm font-bold text-white shadow-sm`}
          >
            {initials(emp.name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-zinc-900 dark:text-zinc-50">{emp.name}</p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
            {emp.designation || emp.role}
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${roleColor(emp.role)}`}
          >
            {emp.role}
          </span>
        </div>
        {/* Net salary ratio pill */}
        <div className="shrink-0 text-right">
          <p className="text-xs text-zinc-400">Net / Gross</p>
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{ratio}%</p>
        </div>
      </div>

      {/* Department & Location */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
        {emp.department && (
          <span className="flex items-center gap-1">
            <Briefcase size={11} />
            {emp.department}
          </span>
        )}
        {emp.workLocation && (
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {emp.workLocation}
          </span>
        )}
      </div>

      {/* Salary bar */}
      <div>
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-zinc-400">Gross {fmt(emp.grossSalary)}</span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-100">
            Net {fmt(emp.netSalary)}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
            style={{ width: `${ratio}%` }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Leaves" value={emp.totalLeaveDays} unit="d" color="rose" />
        <Stat label="WFH" value={emp.totalWFHDays} unit="d" color="sky" />
        <Stat label="LOP" value={emp.lopDays} unit="d" color="amber" />
      </div>

      {/* Hover overlay hint */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center rounded-b-2xl py-1.5 text-[10px] font-medium text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-indigo-400">
        Click to view full breakdown →
      </div>
    </button>
  );
}

function Stat({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  color: "rose" | "sky" | "amber";
}) {
  const clr = {
    rose: "text-rose-600 dark:text-rose-400",
    sky: "text-sky-600 dark:text-sky-400",
    amber: "text-amber-600 dark:text-amber-400",
  }[color];
  return (
    <div className="rounded-xl bg-zinc-50 p-2.5 text-center dark:bg-zinc-800/60">
      <p className={`text-sm font-bold ${clr}`}>
        {value}
        <span className="text-[10px] font-normal">{unit}</span>
      </p>
      <p className="mt-0.5 text-[10px] text-zinc-400">{label}</p>
    </div>
  );
}

// ─── Detail Modal ──────────────────────────────────────────────────────────────

function DetailModal({
  emp,
  month,
  onClose,
  onSubmitSuccess,
}: {
  emp: EmployeePayroll;
  month: string;
  onClose: () => void;
  onSubmitSuccess: () => void;
}) {
  const [year, mon] = month.split("-").map(Number);
  const monthLabel = `${MONTHS[mon - 1]} ${year}`;
  const grad = avatarGradient(emp.name);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSubmitBtn = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/payroll/employees", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: emp.userId,
          employeeName: emp.name,
          month,
          grossSalary: emp.grossSalary,
          totalDeductions: emp.totalDeductions,
          netSalary: emp.netSalary,
          pf: emp.pf,
          tax: emp.tax,
          professionalTax: emp.professionalTax,
          lopDeduction: emp.lopDeduction,
          lopDays: emp.lopDays,
          totalLeaveDays: emp.totalLeaveDays,
          totalWFHDays: emp.totalWFHDays,
          workingDays: emp.workingDays,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `HTTP ${res.status}`);
      }
      onSubmitSuccess();
      onClose();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl dark:bg-zinc-900 sm:rounded-3xl">
        {/* Header gradient banner */}
        <div className={`relative bg-gradient-to-r ${grad} px-6 pb-6 pt-8`}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl bg-white/20 p-1.5 text-white backdrop-blur-sm transition hover:bg-white/30"
          >
            <X size={16} />
          </button>

          <div className="flex items-end gap-4">
            {emp.profileImage ? (
              <img
                src={emp.profileImage}
                alt={emp.name}
                className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white/30"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold text-white backdrop-blur-sm ring-4 ring-white/20">
                {initials(emp.name)}
              </div>
            )}
            <div className="pb-1">
              <h2 className="text-xl font-bold text-white">{emp.name}</h2>
              <p className="text-sm text-white/80">{emp.designation || emp.role}</p>
              <span className="mt-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                {emp.userId}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Month badge */}
          <div className="border-b border-zinc-100 px-6 py-3 dark:border-zinc-800">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Payroll for {monthLabel}
            </p>
          </div>

          <div className="space-y-5 p-6">
            {/* Personal Info */}
            <Section title="Employee Information">
              <InfoGrid>
                <InfoItem icon={<Mail size={14} />} label="Email" value={emp.email} />
                <InfoItem icon={<Phone size={14} />} label="Phone" value={emp.phone || "—"} />
                <InfoItem icon={<Briefcase size={14} />} label="Department" value={emp.department || "—"} />
                <InfoItem icon={<User size={14} />} label="Manager" value={emp.manager || "—"} />
                <InfoItem icon={<MapPin size={14} />} label="Work Location" value={emp.workLocation || "—"} />
                <InfoItem icon={<Calendar size={14} />} label="Joining Date" value={fmtDate(emp.joiningDate)} />
                <InfoItem icon={<User size={14} />} label="Employment Type" value={emp.employmentType || "—"} />
                <InfoItem icon={<User size={14} />} label="Gender" value={emp.gender || "—"} />
              </InfoGrid>
            </Section>

            {/* Salary Breakdown */}
            <Section title="Salary Breakdown">
              <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <SalaryRow
                  icon={<IndianRupee size={14} />}
                  label="Gross Salary"
                  value={fmt(emp.grossSalary)}
                  highlight
                />
                <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
                <SalaryRow
                  icon={<ShieldCheck size={14} />}
                  label={`Provident Fund (PF) — 12%`}
                  value={`− ${fmt(emp.pf)}`}
                  deduction
                />
                <SalaryRow
                  icon={<Receipt size={14} />}
                  label={`TDS — 10%`}
                  value={`− ${fmt(emp.tax)}`}
                  deduction
                />
                <SalaryRow
                  icon={<Receipt size={14} />}
                  label="Professional Tax"
                  value={`− ${fmt(emp.professionalTax)}`}
                  deduction
                />
                {emp.lopDeduction > 0 && (
                  <SalaryRow
                    icon={<AlertCircle size={14} />}
                    label={`LOP Deduction (${emp.lopDays} days)`}
                    value={`− ${fmt(emp.lopDeduction)}`}
                    deduction
                    lopNote
                  />
                )}
                <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
                <SalaryRow
                  icon={<TrendingDown size={14} />}
                  label="Total Deductions"
                  value={`− ${fmt(emp.totalDeductions)}`}
                  deduction
                />
                <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
                <SalaryRow
                  icon={<Wallet size={14} />}
                  label="Net Salary"
                  value={fmt(emp.netSalary)}
                  net
                />
              </div>

              {/* Visual bar */}
              <div className="mt-3 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/60">
                <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
                  <span>Take-home ratio</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {netRatio(emp.netSalary, emp.grossSalary)}%
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                    style={{ width: `${netRatio(emp.netSalary, emp.grossSalary)}%` }}
                  />
                </div>
              </div>
            </Section>

            {/* Attendance Stats */}
            <Section title="Attendance Summary">
              <div className="grid grid-cols-3 gap-3">
                <StatCard
                  label="Working Days"
                  value={emp.workingDays}
                  sub="this month"
                  color="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                />
                <StatCard
                  label="Leave Days"
                  value={emp.totalLeaveDays}
                  sub="approved"
                  color="bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                />
                <StatCard
                  label="WFH Days"
                  value={emp.totalWFHDays}
                  sub="approved"
                  color="bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                />
              </div>
            </Section>

            {/* Leaves */}
            {emp.leaves.length > 0 && (
              <Section title={`Leaves (${emp.leaves.length})`}>
                <div className="space-y-2">
                  {emp.leaves.map((l) => (
                    <div
                      key={l.requestId}
                      className="flex items-center justify-between rounded-xl bg-rose-50/60 px-4 py-3 dark:bg-rose-900/10"
                    >
                      <div>
                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                          {l.leaveType}
                          {l.isHalfDay && (
                            <span className="ml-2 text-[10px] font-semibold text-rose-500 bg-rose-100 rounded px-1 dark:bg-rose-900/40">
                              Half Day
                            </span>
                          )}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {fmtDate(l.startDate)} → {fmtDate(l.endDate)}
                        </p>
                        {l.reason && (
                          <p className="mt-0.5 text-xs text-zinc-400 line-clamp-1">{l.reason}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
                          {l.calculatedDays}d
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* WFH */}
            {emp.wfhRequests.length > 0 && (
              <Section title={`WFH Requests (${emp.wfhRequests.length})`}>
                <div className="space-y-2">
                  {emp.wfhRequests.map((w) => (
                    <div
                      key={w.requestId}
                      className="flex items-center justify-between rounded-xl bg-sky-50/60 px-4 py-3 dark:bg-sky-900/10"
                    >
                      <div>
                        <p className="flex items-center gap-1.5 text-sm font-medium text-zinc-800 dark:text-zinc-100">
                          <Home size={13} className="text-sky-500" />
                          Work From Home
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {fmtDate(w.startDate)} → {fmtDate(w.endDate)}
                        </p>
                        {w.reason && (
                          <p className="mt-0.5 text-xs text-zinc-400 line-clamp-1">{w.reason}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-sky-600 dark:text-sky-400">
                          {w.calculatedDays}d
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {emp.leaves.length === 0 && emp.wfhRequests.length === 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-400 dark:bg-zinc-800/50">
                <Clock size={15} />
                No leave or WFH records for this month.
              </div>
            )}

            <Section title="Payroll Submission">
              <div className="flex w-full flex-col gap-3">
                {emp.payrollStatus === "SUBMITTED" || emp.payrollStatus === "PROCESSED" || emp.payrollStatus === "PAID" ? (
                  <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-900/20">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-800/50">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                        Payroll {emp.payrollStatus === "PAID" ? "Paid" : emp.payrollStatus === "PROCESSED" ? "Processed" : "Submitted"}
                      </p>
                      {emp.submittedAt && (
                        <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                          Submitted on {fmtDate(emp.submittedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Submitting payroll for <span className="font-semibold text-zinc-700 dark:text-zinc-200">{emp.name}</span> will
                      mark salary as <span className="font-semibold">SUBMITTED</span> and credit it on the last working day of {MONTHS[mon - 1]}.
                    </p>
                    {submitError && (
                      <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
                        {submitError}
                      </p>
                    )}
                    <button
                      onClick={handleSubmitBtn}
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Wallet size={14} />
                          Submit Payroll for {MONTHS[mon - 1]}
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </Section>


          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-zinc-400">{title}</h3>
      {children}
    </div>
  );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{children}</div>;
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/60">
      <span className="mt-0.5 shrink-0 text-zinc-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-zinc-400">{label}</p>
        <p className="truncate text-xs font-medium text-zinc-700 dark:text-zinc-200">{value}</p>
      </div>
    </div>
  );
}

function SalaryRow({
  icon,
  label,
  value,
  highlight,
  deduction,
  net,
  lopNote,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
  deduction?: boolean;
  net?: boolean;
  lopNote?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${net
        ? "bg-indigo-50 dark:bg-indigo-900/20"
        : highlight
          ? "bg-zinc-50 dark:bg-zinc-800/40"
          : ""
        }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`${net
            ? "text-indigo-500"
            : deduction
              ? lopNote
                ? "text-amber-500"
                : "text-zinc-400"
              : "text-zinc-500"
            }`}
        >
          {icon}
        </span>
        <span
          className={`text-sm ${net ? "font-bold text-indigo-700 dark:text-indigo-300" : "text-zinc-600 dark:text-zinc-300"
            }`}
        >
          {label}
        </span>
      </div>
      <span
        className={`text-sm font-semibold ${net
          ? "text-indigo-700 dark:text-indigo-300"
          : deduction
            ? "text-rose-600 dark:text-rose-400"
            : "text-zinc-800 dark:text-zinc-100"
          }`}
      >
        {value}
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub: string;
  color: string;
}) {
  return (
    <div className={`rounded-2xl p-4 text-center ${color}`}>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs font-semibold">{label}</p>
      <p className="mt-0.5 text-[10px] opacity-70">{sub}</p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function SalaryPage() {
  const now = new Date();
  const [employees, setEmployees] = useState<EmployeePayroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<EmployeePayroll | null>(null);
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [month, setMonth] = useState(
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  );
  const [workingDays, setWorkingDays] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/payroll/employees?month=${month}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEmployees(data.employees ?? []);
      setWorkingDays(data.workingDays ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 30-second polling — silently refreshes payroll statuses in the background
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Only poll when no modal is open to avoid interrupting the user
      if (!selected) {
        fetch(`/api/payroll/employees?month=${month}`)
          .then((r) => r.ok ? r.json() : null)
          .then((data) => {
            if (data?.employees) {
              setEmployees(data.employees);
              setWorkingDays(data.workingDays ?? 0);
            }
          })
          .catch(() => {/* silent */});
      }
    }, 30_000);
    return () => clearInterval(intervalId);
  }, [month, selected]);

  const departments = ["All", ...Array.from(new Set(employees.map((e) => e.department).filter(Boolean)))];

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      e.name.toLowerCase().includes(q) ||
      e.userId.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      (e.designation ?? "").toLowerCase().includes(q);
    const matchDept = dept === "All" || e.department === dept;
    return matchSearch && matchDept;
  });

  const totalGross = filtered.reduce((s, e) => s + e.grossSalary, 0);
  const totalNet = filtered.reduce((s, e) => s + e.netSalary, 0);
  const totalDeductions = filtered.reduce((s, e) => s + e.totalDeductions, 0);

  const [y, m] = month.split("-").map(Number);
  const monthLabel = `${MONTHS[m - 1]} ${y}`;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Salary &amp; Payroll
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Net salary breakdown for all employees · {monthLabel}
            {workingDays > 0 && (
              <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                {workingDays} working days
              </span>
            )}
          </p>
        </div>

        {/* Month picker */}
        <div className="relative">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="h-9 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-700 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          />
        </div>
      </div>

      {/* Summary cards */}
      {!loading && employees.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SummaryCard
            label="Total Employees"
            value={String(employees.length)}
            sub="on payroll"
            color="from-indigo-500 to-violet-600"
          />
          <SummaryCard
            label="Total Gross"
            value={fmt(totalGross)}
            sub="this month"
            color="from-blue-500 to-cyan-600"
          />
          <SummaryCard
            label="Total Deductions"
            value={fmt(totalDeductions)}
            sub="PF + TDS + LOP"
            color="from-rose-500 to-pink-600"
          />
          <SummaryCard
            label="Total Net Payout"
            value={fmt(totalNet)}
            sub="to disburse"
            color="from-emerald-500 to-teal-600"
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, email…"
            className="h-9 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-4 text-sm text-zinc-700 shadow-sm transition placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          />
        </div>
        {/* Department filter */}
        <div className="relative">
          <select
            value={dept}
            onChange={(e) => setDept(e.target.value)}
            className="h-9 appearance-none rounded-xl border border-zinc-200 bg-white pl-3 pr-8 text-sm text-zinc-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
          />
        </div>
        {/* Refresh */}
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex h-9 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-600 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* States */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-52 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-10 text-center dark:border-rose-800 dark:bg-rose-900/20">
          <AlertCircle size={32} className="text-rose-400" />
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>
          <button
            onClick={fetchData}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-zinc-50 p-12 text-center dark:bg-zinc-800/40">
          <User size={32} className="text-zinc-300" />
          <p className="text-sm text-zinc-500">
            {employees.length === 0 ? "No employees found." : "No results match your filters."}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((emp) => (
            <EmployeeCard key={emp.userId} emp={emp} onClick={() => setSelected(emp)} />
          ))}
        </div>
      )}

      {selected && (
        <DetailModal
          emp={selected}
          month={month}
          onClose={() => setSelected(null)}
          onSubmitSuccess={fetchData}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-4 text-white shadow-sm`}
    >
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/10" />
      <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{label}</p>
      <p className="mt-1 text-lg font-black leading-tight">{value}</p>
      <p className="mt-0.5 text-[11px] opacity-70">{sub}</p>
    </div>
  );
}
