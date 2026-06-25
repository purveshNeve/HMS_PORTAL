"use client";

import { useMemo, useState } from "react";
import { Eye, Reply, Archive, CheckCheck } from "lucide-react";
import { receivedFeedback } from "@/data/mockDataFeedback";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { RatingStars } from "@/components/ui/RatingStars";
import { Badge } from "@/components/ui/BadgeFeedback";
import { TableFilterBar, FilterConfig } from "./TableFilterBar";
import { RowActionsMenu } from "./RowActionsMenu";

const filters: FilterConfig[] = [
  { key: "category", label: "Category", options: Array.from(new Set(receivedFeedback.map((f) => f.category))) },
  { key: "rating", label: "Rating", options: ["5", "4", "3", "2", "1"] },
  { key: "status", label: "Status", options: ["Unread", "Read", "Archived"] },
  { key: "sender", label: "Sender", options: Array.from(new Set(receivedFeedback.map((f) => f.sender))) },
];

export function ReceivedTab() {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    return receivedFeedback.filter((f) => {
      if (search && !`${f.sender} ${f.subject}`.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (activeFilters.category && activeFilters.category !== "All" && f.category !== activeFilters.category) {
        return false;
      }
      if (activeFilters.rating && activeFilters.rating !== "All" && f.rating !== Number(activeFilters.rating)) {
        return false;
      }
      if (activeFilters.status && activeFilters.status !== "All" && f.status !== activeFilters.status) {
        return false;
      }
      if (activeFilters.sender && activeFilters.sender !== "All" && f.sender !== activeFilters.sender) {
        return false;
      }
      return true;
    });
  }, [search, activeFilters]);

  return (
    <Card className="overflow-hidden">
      <TableFilterBar
        searchPlaceholder="Search by sender or subject…"
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
              <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Sender</th>
              <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Date</th>
              <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Category</th>
              <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Rating</th>
              <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Visibility</th>
              <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Status</th>
              <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-surface-subtle/50 transition-colors">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold shrink-0">
                      {item.senderInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-ink font-medium leading-tight truncate">{item.sender}</p>
                      <p className="text-xs text-ink-faint leading-tight truncate">{item.subject}</p>
                    </div>
                    {item.status === "Unread" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-ink-muted whitespace-nowrap">{item.date}</td>
                <td className="px-3 py-2.5">
                  <Badge variant="neutral">{item.category}</Badge>
                </td>
                <td className="px-3 py-2.5">
                  <RatingStars rating={item.rating} />
                </td>
                <td className="px-3 py-2.5 text-ink-muted whitespace-nowrap">{item.visibility}</td>
                <td className="px-3 py-2.5">
                  <StatusPill status={item.status} />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <RowActionsMenu
                    actions={[
                      { label: "View", icon: Eye },
                      { label: "Reply", icon: Reply },
                      { label: "Mark as Read", icon: CheckCheck },
                      { label: "Archive", icon: Archive, destructive: true },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-ink-muted">No feedback matches your filters.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-3 py-2.5 border-t border-border text-xs text-ink-faint">
        <span>
          Showing {filtered.length} of {receivedFeedback.length} entries
        </span>
      </div>
    </Card>
  );
}
