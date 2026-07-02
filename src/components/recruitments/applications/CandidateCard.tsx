"use client";

import { Star, Briefcase } from "lucide-react";
import { Candidate } from "@/lib/types";
import { cn } from "@/lib/utils";

function scoreColor(score: number) {
  if (score >= 85) return "text-evergreen-600 border-evergreen-200 bg-evergreen-50 dark:bg-evergreen-900/30 dark:text-evergreen-300 dark:border-evergreen-700";
  if (score >= 70) return "text-gold-700 border-gold-200 bg-gold-50 dark:bg-gold-900/30 dark:text-gold-300 dark:border-gold-700";
  return "text-coral-600 border-coral-200 bg-coral-50 dark:bg-coral-900/30 dark:text-coral-300 dark:border-coral-700";
}

export function CandidateCard({
  candidate,
  onOpen,
  draggable,
  selected,
  onToggleSelect,
}: {
  candidate: Candidate;
  onOpen: () => void;
  draggable?: boolean;
  selected?: boolean;
  onToggleSelect?: () => void;
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", candidate.id);
      }}
      onClick={onOpen}
      className={cn(
        "group cursor-pointer rounded-xl border bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-card dark:bg-surface-darkcard",
        selected ? "border-evergreen-400 ring-2 ring-evergreen-200 dark:ring-evergreen-800" : "border-ink-100 dark:border-ink-700"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <img src={candidate.avatar} alt={candidate.name} className="h-9 w-9 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink-800 dark:text-ink-100">{candidate.name}</p>
            <p className="truncate text-[11px] text-ink-400">{candidate.positionApplied}</p>
          </div>
        </div>
        <span className={cn("shrink-0 rounded-full border px-2 py-0.5 font-mono text-[11px] font-semibold", scoreColor(candidate.matchScore))}>
          {candidate.matchScore}%
        </span>
      </div>

      {candidate.tags.length > 0 && (
        <div className="mt-2 flex gap-1">
          {candidate.tags.map((t) => (
            <span key={t} className="chip bg-gold-50 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-2.5 flex flex-wrap gap-1">
        {candidate.skills.map((s) => (
          <span key={s} className="chip bg-ink-50 text-ink-500 dark:bg-ink-700 dark:text-ink-300">
            {s}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-ink-400">
        <span className="flex items-center gap-1">
          <Briefcase size={11} /> {candidate.experience}
        </span>
        <span className="flex items-center gap-1">
          <Star size={11} className="fill-gold-400 text-gold-400" /> {candidate.rating}
        </span>
      </div>

      {onToggleSelect && (
        <label className="mt-3 flex items-center gap-2 border-t border-ink-100 pt-2.5 text-[11px] text-ink-400 dark:border-ink-700" onClick={(e) => e.stopPropagation()}>
          <input type="checkbox" checked={selected} onChange={onToggleSelect} className="h-3.5 w-3.5 rounded border-ink-300 text-evergreen-700" />
          Select to compare
        </label>
      )}
    </div>
  );
}
