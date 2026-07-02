"use client";

import { Candidate } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Star } from "lucide-react";

export function CandidateTable({
  candidates,
  onOpen,
  selectedIds,
  onToggleSelect,
}: {
  candidates: Candidate[];
  onOpen: (c: Candidate) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
}) {
  return (
    <div className="card-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 bg-ink-50/60 text-[11px] uppercase tracking-wide text-ink-400 dark:border-ink-700 dark:bg-ink-800/40">
              <th className="w-10 px-4 py-3" />
              <th className="px-4 py-3 font-medium">Candidate</th>
              <th className="px-4 py-3 font-medium">Position</th>
              <th className="px-4 py-3 font-medium">Experience</th>
              <th className="px-4 py-3 font-medium">Match Score</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Applied</th>
              <th className="px-4 py-3 font-medium">Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-700">
            {candidates.map((c) => (
              <tr
                key={c.id}
                onClick={() => onOpen(c)}
                className="cursor-pointer transition-colors hover:bg-ink-50/60 dark:hover:bg-ink-800/40"
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(c.id)}
                    onChange={() => onToggleSelect(c.id)}
                    className="h-3.5 w-3.5 rounded border-ink-300 text-evergreen-700"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <img src={c.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                    <div>
                      <p className="font-medium text-ink-800 dark:text-ink-100">{c.name}</p>
                      <p className="text-xs text-ink-400">{c.education}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-600 dark:text-ink-300">{c.positionApplied}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-600 dark:text-ink-300">{c.experience}</td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs font-semibold text-evergreen-700 dark:text-evergreen-300">{c.matchScore}%</span>
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-xs text-ink-600 dark:text-ink-300">
                    <Star size={12} className="fill-gold-400 text-gold-400" /> {c.rating}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink-500 dark:text-ink-400">{c.applicationDate.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.stage} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
