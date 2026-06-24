"use client";

import { GoalStatus, GoalCategory, GoalPriority, STATUS_LABELS, CATEGORY_LABELS } from "@/lib/goals.types";
import { Search, X } from "lucide-react";

export interface GoalFilters {
  search: string;
  status: GoalStatus | "";
  category: GoalCategory | "";
  priority: GoalPriority | "";
}

interface GoalFiltersBarProps {
  filters: GoalFilters;
  onChange: (f: GoalFilters) => void;
}

const selectClass =
  "border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition";

export default function GoalFiltersBar({ filters, onChange }: GoalFiltersBarProps) {
  function set(key: keyof GoalFilters, value: string) {
    onChange({ ...filters, [key]: value });
  }

  const hasFilters = filters.search || filters.status || filters.category || filters.priority;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Search goals…"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
        />
      </div>

      {/* Status */}
      <select className={selectClass} value={filters.status} onChange={(e) => set("status", e.target.value)}>
        <option value="">All Statuses</option>
        {(Object.keys(STATUS_LABELS) as GoalStatus[]).map((s) => (
          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
        ))}
      </select>

      {/* Category */}
      <select className={selectClass} value={filters.category} onChange={(e) => set("category", e.target.value)}>
        <option value="">All Categories</option>
        {(Object.keys(CATEGORY_LABELS) as GoalCategory[]).map((c) => (
          <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
        ))}
      </select>

      {/* Priority */}
      <select className={selectClass} value={filters.priority} onChange={(e) => set("priority", e.target.value)}>
        <option value="">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => onChange({ search: "", status: "", category: "", priority: "" })}
          className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition"
        >
          <X size={12} /> Clear
        </button>
      )}
    </div>
  );
}
