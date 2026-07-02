"use client";

import { Search, LayoutGrid, KanbanSquare, GitCompare } from "lucide-react";
import { departments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function CandidateFilters({
  search,
  setSearch,
  department,
  setDepartment,
  source,
  setSource,
  view,
  setView,
  compareCount,
  onOpenCompare,
  resultCount,
}: {
  search: string;
  setSearch: (v: string) => void;
  department: string;
  setDepartment: (v: string) => void;
  source: string;
  setSource: (v: string) => void;
  view: "kanban" | "table";
  setView: (v: "kanban" | "table") => void;
  compareCount: number;
  onOpenCompare: () => void;
  resultCount: number;
}) {
  return (
    <div className="card-surface flex flex-col gap-3 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates by name, skill, or role…"
            className="w-full rounded-xl border border-ink-100 bg-white py-2.5 pl-9 pr-3 text-sm text-ink-700 placeholder:text-ink-400 focus:border-evergreen-400 focus:outline-none dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-100"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm text-ink-600 focus:border-evergreen-400 focus:outline-none dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-200"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm text-ink-600 focus:border-evergreen-400 focus:outline-none dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-200"
          >
            <option value="all">All Sources</option>
            {["LinkedIn", "Referral", "Career Portal", "Job Boards", "Agency"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenCompare}
            disabled={compareCount < 2}
            className="btn-secondary text-xs disabled:cursor-not-allowed disabled:opacity-40"
          >
            <GitCompare size={14} /> Compare {compareCount > 0 && `(${compareCount})`}
          </button>

          <div className="flex items-center gap-1 rounded-xl border border-ink-100 p-1 dark:border-ink-700">
            <button
              onClick={() => setView("kanban")}
              className={cn("rounded-lg p-1.5", view === "kanban" ? "bg-evergreen-800 text-white" : "text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700")}
              aria-label="Kanban view"
            >
              <KanbanSquare size={15} />
            </button>
            <button
              onClick={() => setView("table")}
              className={cn("rounded-lg p-1.5", view === "table" ? "bg-evergreen-800 text-white" : "text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700")}
              aria-label="Table view"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>
      <p className="text-xs text-ink-400">{resultCount} candidates found</p>
    </div>
  );
}
