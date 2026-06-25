"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil, RotateCcw, Copy } from "lucide-react";
import { sentFeedback } from "@/data/mockDataFeedback";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { Badge } from "@/components/ui/BadgeFeedback";
import { TableFilterBar, FilterConfig } from "./TableFilterBar";
import { RowActionsMenu } from "./RowActionsMenu";

const filters: FilterConfig[] = [
  { key: "category", label: "Category", options: Array.from(new Set(sentFeedback.map((f) => f.category))) },
  { key: "status", label: "Status", options: ["Sent", "Draft", "Withdrawn"] },
];

export function SentTab() {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    return sentFeedback.filter((f) => {
      if (search && !`${f.recipient} ${f.subject}`.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (activeFilters.category && activeFilters.category !== "All" && f.category !== activeFilters.category) {
        return false;
      }
      if (activeFilters.status && activeFilters.status !== "All" && f.status !== activeFilters.status) {
        return false;
      }
      return true;
    });
  }, [search, activeFilters]);

  return (
    <Card className="overflow-hidden">
      <TableFilterBar
        searchPlaceholder="Search by recipient or subject…"
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={(key, value) => setActiveFilters((prev) => ({ ...prev, [key]: value }))}
        onClearFilters={() => setActiveFilters({})}
        searchValue={search}
        onSearchChange={setSearch}
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-subtle/60 text-left">
              <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Recipient</th>
              <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Date</th>
              <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Category</th>
              <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Status</th>
              <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Visibility</th>
              <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Delivery</th>
              <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-surface-subtle/50 transition-colors">
                <td className="px-3 py-2.5">
                  <p className="text-sm text-ink font-medium leading-tight">{item.recipient}</p>
                  <p className="text-xs text-ink-faint leading-tight">{item.subject}</p>
                </td>
                <td className="px-3 py-2.5 text-ink-muted whitespace-nowrap">{item.date}</td>
                <td className="px-3 py-2.5">
                  <Badge variant="neutral">{item.category}</Badge>
                </td>
                <td className="px-3 py-2.5">
                  <StatusPill status={item.status} />
                </td>
                <td className="px-3 py-2.5 text-ink-muted whitespace-nowrap">{item.visibility}</td>
                <td className="px-3 py-2.5">
                  <StatusPill status={item.deliveryStatus} />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <RowActionsMenu
                    actions={[
                      { label: "View", icon: Eye },
                      { label: "Edit Draft", icon: Pencil },
                      { label: "Duplicate", icon: Copy },
                      { label: "Withdraw", icon: RotateCcw, destructive: true },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-ink-muted">No sent feedback matches your filters.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-3 py-2.5 border-t border-border text-xs text-ink-faint">
        <span>
          Showing {filtered.length} of {sentFeedback.length} entries
        </span>
      </div>
    </Card>
  );
}
