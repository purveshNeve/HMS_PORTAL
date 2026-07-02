"use client";

import { useMemo, useState } from "react";
import { Users, UserCheck, Clock3, TrendingUp, UploadCloud } from "lucide-react";
import { PageShell } from "@/components/ui/PageShell";
import { KpiCard } from "@/components/ui/KpiCard";
import { CandidateFilters } from "@/components/recruitments/applications/CandidateFilters";
import { KanbanBoard } from "@/components/recruitments/applications/KanbanBoard";
import { CandidateTable } from "@/components/recruitments/applications/CandidateTable";
import { CandidateDrawer } from "@/components/recruitments/applications/CandidateDrawer";
import { CandidateComparisonModal } from "@/components/recruitments/applications/CandidateComparisonModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { candidates as initialCandidates } from "@/lib/mock-data";
import { Candidate, PipelineStage } from "@/lib/types";
import { cn } from "@/lib/utils";

const stageTabs: (PipelineStage | "All")[] = [
  "All", "Applied", "Screening", "Shortlisted", "Interview Scheduled",
  "Technical Round", "HR Round", "Selected", "Offer Released", "Joined", "Rejected",
];

export default function ApplicationsPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [source, setSource] = useState("all");
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const [activeTab, setActiveTab] = useState<(typeof stageTabs)[number]>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openCandidate, setOpenCandidate] = useState<Candidate | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.positionApplied.toLowerCase().includes(search.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
      const matchesDept = department === "all" || c.department === department;
      const matchesSource = source === "all" || c.source === source;
      const matchesTab = activeTab === "All" || c.stage === activeTab;
      return matchesSearch && matchesDept && matchesSource && matchesTab;
    });
  }, [candidates, search, department, source, activeTab]);

  const stats = useMemo(() => {
    const shortlisted = candidates.filter((c) => ["Shortlisted", "Interview Scheduled", "Technical Round", "HR Round"].includes(c.stage)).length;
    const avgMatch = Math.round(candidates.reduce((s, c) => s + c.matchScore, 0) / candidates.length);
    const joined = candidates.filter((c) => c.stage === "Joined").length;
    return { total: candidates.length, shortlisted, avgMatch, joined };
  }, [candidates]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });
  };

  const handleMove = (candidateId: string, stage: PipelineStage) => {
    setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, stage } : c)));
  };

  const handleAddNote = () => {
    // Notes are held locally within the drawer; hook point for persistence.
  };

  const compareList = candidates.filter((c) => selected.has(c.id));

  return (
    <PageShell onCreate={() => alert("Resume upload flow would open here (drag & drop, parsing, auto profile generation).")} createLabel="Upload Resume">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Applications" value={String(stats.total)} delta={12.3} trend="up" icon={Users} index={0} />
          <KpiCard label="In Active Pipeline" value={String(stats.shortlisted)} delta={6.8} trend="up" icon={UserCheck} index={1} />
          <KpiCard label="Avg. Match Score" value={`${stats.avgMatch}%`} delta={2.1} trend="up" icon={TrendingUp} index={2} />
          <KpiCard label="Joined This Year" value={String(stats.joined)} delta={9.4} trend="up" icon={Clock3} index={3} />
        </section>

        <CandidateFilters
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={setDepartment}
          source={source}
          setSource={setSource}
          view={view}
          setView={setView}
          compareCount={selected.size}
          onOpenCompare={() => setCompareOpen(true)}
          resultCount={filtered.length}
        />

        {/* Stage tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {stageTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
                activeTab === tab
                  ? "border-evergreen-700 bg-evergreen-800 text-white"
                  : "border-ink-100 bg-white text-ink-500 hover:border-ink-300 dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-300"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={UploadCloud}
            title="No candidates match your filters"
            description="Try a different search term or stage, or upload a resume to add a new candidate to the pipeline."
          />
        ) : view === "kanban" ? (
          <KanbanBoard
            candidates={filtered}
            onOpen={setOpenCandidate}
            onMove={handleMove}
            selectedIds={selected}
            onToggleSelect={toggleSelect}
          />
        ) : (
          <CandidateTable candidates={filtered} onOpen={setOpenCandidate} selectedIds={selected} onToggleSelect={toggleSelect} />
        )}
      </div>

      <CandidateDrawer
        candidate={openCandidate}
        onClose={() => setOpenCandidate(null)}
        onUpdateStage={(id, stage) => {
          handleMove(id, stage);
          setOpenCandidate((prev) => (prev && prev.id === id ? { ...prev, stage } : prev));
        }}
        onAddNote={handleAddNote}
      />

      <CandidateComparisonModal open={compareOpen} onClose={() => setCompareOpen(false)} candidates={compareList} />
    </PageShell>
  );
}
