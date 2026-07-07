"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Download, FileSpreadsheet, Printer, Sparkles, Users } from "lucide-react";
import { skillMatrix, departments } from "@/data/skillDevelopmentData";
import ProgressRing from "@/components/ui/ProgressRing";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { exportToCSV, exportToExcel } from "@/lib/export_cultural";
import { useToast } from "@/lib/toast";

const PAGE_SIZE = 6;

function scoreColor(score: number) {
  if (score >= 75) return "#4C8B62";
  if (score >= 50) return "#E8A33D";
  return "#F0665A";
}

export default function SkillMatrixView() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return skillMatrix.filter((row) => {
      const matchesSearch =
        row.employee.toLowerCase().includes(search.toLowerCase()) ||
        row.role.toLowerCase().includes(search.toLowerCase());
      const matchesDept = departmentFilter === "All" || row.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [search, departmentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExportCSV = () => {
    exportToCSV(
      filtered.map((r) => ({
        employee: r.employee,
        department: r.department,
        role: r.role,
        skillScore: r.skillScore,
        learningProgress: r.learningProgress,
        gap: r.requiredSkills.filter((s) => !r.currentSkills.includes(s)).join("; "),
      })),
      "employee-skill-matrix"
    );
    toast("Exported skill matrix to CSV.", "info");
  };

  const handleExportExcel = () => {
    exportToExcel(
      filtered.map((r) => ({
        employee: r.employee,
        department: r.department,
        role: r.role,
        skillScore: r.skillScore,
        learningProgress: r.learningProgress,
        gap: r.requiredSkills.filter((s) => !r.currentSkills.includes(s)).join("; "),
      })),
      "employee-skill-matrix"
    );
    toast("Exported skill matrix to Excel.", "info");
  };

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 rounded-xl2 border border-line bg-card p-4 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search employees or roles…"
              className="w-full rounded-full border border-line bg-paper/60 py-2 pl-8 pr-3 text-xs outline-none transition-colors focus:border-indigoink focus:bg-card"
            />
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => { setDepartmentFilter(e.target.value); setPage(1); }}
            className="rounded-full border border-line bg-paper/60 px-3 py-2 text-xs font-medium outline-none focus:border-indigoink"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleExportCSV} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-paper">
            <Download className="h-3.5 w-3.5" /> CSV
          </button>
          <button onClick={handleExportExcel} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-paper">
            <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs font-medium text-ink transition-colors hover:bg-paper">
            <Printer className="h-3.5 w-3.5" /> Print
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No employees found" description="Try a different search term or department filter." />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {paged.map((row, i) => {
            const gap = row.requiredSkills.filter((s) => !row.currentSkills.includes(s));
            return (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-xl2 border border-line bg-card p-5 shadow-soft"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-semibold text-ink">{row.employee}</h3>
                    <p className="text-xs text-muted">{row.role} · {row.department}</p>
                  </div>
                  <ProgressRing value={row.skillScore} size={54} color={scoreColor(row.skillScore)} />
                </div>

                <div className="mt-4">
                  <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted">Current Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {row.currentSkills.map((s) => (
                      <span key={s} className="rounded-full bg-moss-light px-2.5 py-1 text-[11px] font-medium text-moss">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted">Skill Gap</p>
                  <div className="flex flex-wrap gap-1.5">
                    {gap.length === 0 ? (
                      <span className="rounded-full bg-moss-light px-2.5 py-1 text-[11px] font-medium text-moss">
                        No gaps — fully skilled
                      </span>
                    ) : (
                      gap.map((s) => (
                        <span key={s} className="rounded-full bg-coral-light px-2.5 py-1 text-[11px] font-medium text-coral">{s}</span>
                      ))
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-wide text-muted">
                    <span>Learning Progress</span>
                    <span>{row.learningProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-slateblue" style={{ width: `${row.learningProgress}%` }} />
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-lg bg-indigoink-light p-3">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigoink" />
                  <p className="text-[11.5px] leading-relaxed text-indigoink">{row.recommendation}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="mt-4">
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
