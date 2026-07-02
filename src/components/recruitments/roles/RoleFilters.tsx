"use client";

import { Search, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { departments } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export type SortKey = "newest" | "applications" | "priority" | "deadline";

export function RoleFilters({
  search,
  setSearch,
  department,
  setDepartment,
  status,
  setStatus,
  priority,
  setPriority,
  sort,
  setSort,
  view,
  setView,
  resultCount,
}: {
  search: string;
  setSearch: (v: string) => void;
  department: string;
  setDepartment: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  priority: string;
  setPriority: (v: string) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  view: "grid" | "table";
  setView: (v: "grid" | "table") => void;
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
            placeholder="Search roles by title, skill, or manager…"
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
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm text-ink-600 focus:border-evergreen-400 focus:outline-none dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-200"
          >
            <option value="all">All Statuses</option>
            {["Open", "On Hold", "Closed", "Draft", "Pending Approval"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm text-ink-600 focus:border-evergreen-400 focus:outline-none dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-200"
          >
            <option value="all">All Priorities</option>
            {["Critical", "High", "Medium", "Low"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <div className="relative">
            <ArrowUpDown size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-xl border border-ink-100 bg-white py-2.5 pl-8 pr-3 text-sm text-ink-600 focus:border-evergreen-400 focus:outline-none dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-200"
            >
              <option value="newest">Newest</option>
              <option value="applications">Most Applications</option>
              <option value="priority">Priority</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-ink-100 p-1 dark:border-ink-700">
            <button
              onClick={() => setView("grid")}
              className={cn("rounded-lg p-1.5", view === "grid" ? "bg-evergreen-800 text-white" : "text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700")}
              aria-label="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView("table")}
              className={cn("rounded-lg p-1.5", view === "table" ? "bg-evergreen-800 text-white" : "text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700")}
              aria-label="Table view"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>
      <p className="text-xs text-ink-400">{resultCount} roles found</p>
    </div>
  );
}
