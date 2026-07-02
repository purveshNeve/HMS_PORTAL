"use client";

import { useState } from "react";
import { Candidate, PipelineStage } from "@/lib/types";
import { CandidateCard } from "./CandidateCard";
import { cn } from "@/lib/utils";

const stages: { key: PipelineStage; color: string }[] = [
  { key: "Applied", color: "bg-ink-300" },
  { key: "Screening", color: "bg-sky-400" },
  { key: "Shortlisted", color: "bg-evergreen-400" },
  { key: "Interview Scheduled", color: "bg-gold-400" },
  { key: "Technical Round", color: "bg-gold-500" },
  { key: "HR Round", color: "bg-gold-600" },
  { key: "Selected", color: "bg-evergreen-600" },
  { key: "Offer Released", color: "bg-evergreen-700" },
  { key: "Joined", color: "bg-evergreen-900" },
  { key: "Rejected", color: "bg-coral-500" },
];

export function KanbanBoard({
  candidates,
  onOpen,
  onMove,
  selectedIds,
  onToggleSelect,
}: {
  candidates: Candidate[];
  onOpen: (c: Candidate) => void;
  onMove: (candidateId: string, stage: PipelineStage) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
}) {
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-3">
      {stages.map((stage) => {
        const items = candidates.filter((c) => c.stage === stage.key);
        return (
          <div
            key={stage.key}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverStage(stage.key);
            }}
            onDragLeave={() => setDragOverStage((s) => (s === stage.key ? null : s))}
            onDrop={(e) => {
              e.preventDefault();
              const id = e.dataTransfer.getData("text/plain");
              if (id) onMove(id, stage.key);
              setDragOverStage(null);
            }}
            className={cn(
              "flex w-[270px] shrink-0 flex-col rounded-2xl border border-ink-100 bg-ink-50/50 p-3 transition-colors dark:border-ink-700 dark:bg-ink-800/30",
              dragOverStage === stage.key && "border-evergreen-400 bg-evergreen-50/60 dark:bg-evergreen-900/20"
            )}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", stage.color)} />
                <span className="text-xs font-semibold text-ink-700 dark:text-ink-200">{stage.key}</span>
              </div>
              <span className="font-mono text-[11px] text-ink-400">{items.length}</span>
            </div>
            <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto" style={{ maxHeight: 560 }}>
              {items.map((c) => (
                <CandidateCard
                  key={c.id}
                  candidate={c}
                  draggable
                  onOpen={() => onOpen(c)}
                  selected={selectedIds.has(c.id)}
                  onToggleSelect={() => onToggleSelect(c.id)}
                />
              ))}
              {items.length === 0 && (
                <div className="rounded-lg border border-dashed border-ink-200 py-6 text-center text-[11px] text-ink-300 dark:border-ink-700">
                  Drop candidates here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
