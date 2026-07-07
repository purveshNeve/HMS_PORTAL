"use client";

import { Star } from "lucide-react";
import { Modal } from "@/components/ui/Modal-copy";
import { Candidate } from "@/lib/types";
import StatusBadge from "@/components/ui/StatusBadge";

export function CandidateComparisonModal({
  open,
  onClose,
  candidates,
}: {
  open: boolean;
  onClose: () => void;
  candidates: Candidate[];
}) {
  const rows: { label: string; render: (c: Candidate) => React.ReactNode }[] = [
    { label: "Position", render: (c) => c.positionApplied },
    { label: "Experience", render: (c) => c.experience },
    { label: "Education", render: (c) => c.education },
    {
      label: "Match Score",
      render: (c) => <span className="font-mono font-semibold text-evergreen-700 dark:text-evergreen-300">{c.matchScore}%</span>,
    },
    {
      label: "Rating",
      render: (c) => (
        <span className="flex items-center gap-1">
          <Star size={12} className="fill-gold-400 text-gold-400" /> {c.rating}
        </span>
      ),
    },
    { label: "Skills", render: (c) => c.skills.join(", ") },
    { label: "Source", render: (c) => c.source },
    { label: "Stage", render: (c) => <StatusBadge status={c.stage} /> },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Compare Candidates" subtitle={`${candidates.length} candidates selected`} size="lg">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-32" />
              {candidates.map((c) => (
                <th key={c.id} className="px-3 pb-4 text-left">
                  <div className="flex flex-col items-start gap-2">
                    <img src={c.avatar} alt={c.name} className="h-12 w-12 rounded-xl object-cover" />
                    <span className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">{c.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-700">
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="py-3 pr-3 text-xs font-medium uppercase tracking-wide text-ink-400">{row.label}</td>
                {candidates.map((c) => (
                  <td key={c.id} className="px-3 py-3 text-sm text-ink-700 dark:text-ink-200">
                    {row.render(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
