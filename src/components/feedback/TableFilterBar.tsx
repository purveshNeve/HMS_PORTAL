"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/ButtonFeedback";

export interface FilterConfig {
  key: string;
  label: string;
  options: string[];
}

interface TableFilterBarProps {
  searchPlaceholder: string;
  filters: FilterConfig[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function TableFilterBar({
  searchPlaceholder,
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
  searchValue,
  onSearchChange,
}: TableFilterBarProps) {
  const hasActiveFilters = Object.values(activeFilters).some((v) => v && v !== "All");

  return (
    <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 border-b border-border bg-surface-subtle/40">
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full h-8 rounded-md border border-border bg-surface-raised pl-8 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
        />
      </div>

      <div className="hidden sm:flex items-center gap-1.5 text-ink-faint">
        <SlidersHorizontal size={13} />
      </div>

      {filters.map((filter) => (
        <select
          key={filter.key}
          value={activeFilters[filter.key] ?? "All"}
          onChange={(e) => onFilterChange(filter.key, e.target.value)}
          className="h-8 rounded-md border border-border bg-surface-raised px-2.5 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
        >
          <option value="All">{filter.label}: All</option>
          {filter.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ))}

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X size={12} />
          Clear filters
        </Button>
      )}
    </div>
  );
}
