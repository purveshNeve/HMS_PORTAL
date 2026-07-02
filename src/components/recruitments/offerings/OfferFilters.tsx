"use client";

import { Search } from "lucide-react";

const statuses = ["Draft", "Pending Approval", "Approved", "Sent", "Viewed", "Accepted", "Rejected", "Negotiating", "Expired"];

export function OfferFilters({
  search,
  setSearch,
  status,
  setStatus,
  resultCount,
}: {
  search: string;
  setSearch: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  resultCount: number;
}) {
  return (
    <div className="card-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by candidate or position…"
            className="w-full rounded-xl border border-ink-100 bg-white py-2.5 pl-9 pr-3 text-sm text-ink-700 placeholder:text-ink-400 focus:border-evergreen-400 focus:outline-none dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-100"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm text-ink-600 focus:border-evergreen-400 focus:outline-none dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-200"
        >
          <option value="all">All Statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <p className="whitespace-nowrap text-xs text-ink-400">{resultCount} offers</p>
    </div>
  );
}
