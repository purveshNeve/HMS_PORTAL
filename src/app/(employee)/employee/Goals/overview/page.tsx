"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import GoalStats from "@/components/goals/GoalStats";
import GoalCard from "@/components/goals/GoalCard";
import GoalDetailModal from "@/components/goals/GoalDetailModal";
import GoalFiltersBar, { GoalFilters } from "@/components/goals/GoalFiltersBar";
import { Goal, GoalMilestone, GoalComment } from "@/lib/goals.types";
import { LayoutGrid, List, Loader2, Target } from "lucide-react";

export default function EmployeeGoalPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewGoal, setViewGoal] = useState<Goal | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState<GoalFilters>({
    search: "", status: "", category: "", priority: "",
  });

  // Fetch goals assigned to the logged-in employee
  const loadGoals = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/goals");
      if (!res.ok) throw new Error("Failed to load goals");
      const data = await res.json();
      setGoals(
        (data.goals ?? []).map((g: Goal & { _id?: string }) => ({
          ...g,
          id: g._id ?? g.id,
          milestones: g.milestones ?? [],
          comments: g.comments ?? [],
        }))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadGoals(); }, [loadGoals]);

  const filtered = useMemo(() => {
    return goals.filter((g) => {
      if (filters.search && !g.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !g.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.status && g.status !== filters.status) return false;
      if (filters.category && g.category !== filters.category) return false;
      if (filters.priority && g.priority !== filters.priority) return false;
      return true;
    });
  }, [goals, filters]);

  // Employee updates only their progress via PATCH /api/goals/[goalId]
  async function handleUpdateProgress(goalId: string, progress: number) {
    // Optimistic update first for instant feedback
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, progress } : g))
    );
    setViewGoal((g) => (g?.id === goalId ? { ...g, progress } : g));
    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateProgress", progress }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update");
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not save progress");
    }
  }

  async function handleToggleMilestone(goalId: string, milestoneId: string) {
    // Optimistic toggle in local state
    const toggle = (ms: GoalMilestone[]) =>
      ms.map((m) => (m.id === milestoneId ? { ...m, completed: !m.completed } : m));
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, milestones: toggle(g.milestones) } : g
      )
    );
    setViewGoal((g) => {
      if (!g || g.id !== goalId) return g;
      return { ...g, milestones: toggle(g.milestones) };
    });
    // Persist to DB
    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleMilestone", milestoneId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update milestone");
      }
    } catch (e) {
      // Revert optimistic update on error
      setGoals((prev) =>
        prev.map((g) =>
          g.id === goalId ? { ...g, milestones: toggle(g.milestones) } : g
        )
      );
      setViewGoal((g) => {
        if (!g || g.id !== goalId) return g;
        return { ...g, milestones: toggle(g.milestones) };
      });
      alert(e instanceof Error ? e.message : "Could not update milestone");
    }
  }

  function handleAddMilestone(goalId: string, milestone: Omit<GoalMilestone, "id">) {
    const newM: GoalMilestone = { ...milestone, id: Date.now().toString() };
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, milestones: [...g.milestones, newM] } : g
      )
    );
    setViewGoal((g) =>
      g?.id === goalId ? { ...g, milestones: [...g.milestones, newM] } : g
    );
  }

  function handleDeleteMilestone(goalId: string, milestoneId: string) {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, milestones: g.milestones.filter((m) => m.id !== milestoneId) }
          : g
      )
    );
    setViewGoal((g) =>
      g?.id === goalId
        ? { ...g, milestones: g.milestones.filter((m) => m.id !== milestoneId) }
        : g
    );
  }

  function handleAddComment(goalId: string, comment: GoalComment) {
    const appendComment = (comments: GoalComment[]) =>
      comments.some((c) => c.id === comment.id) ? comments : [...comments, comment];

    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, comments: appendComment(g.comments) } : g
      )
    );
    setViewGoal((g) =>
      g?.id === goalId ? { ...g, comments: appendComment(g.comments) } : g
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page header — NO Add Goal button for employees */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Target size={20} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">My Goals</h2>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading
              ? "Loading…"
              : `${goals.length} goals assigned · ${goals.filter(g => g.status === "completed").length} completed`}
          </p>
        </div>
        {/* View toggle only */}
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setView("grid")}
            className={`p-2 ${view === "grid" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"} transition`}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 ${view === "list" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"} transition`}
          >
            <List size={15} />
          </button>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 size={22} className="animate-spin mr-2" /> Loading goals…
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* Stats */}
      {!loading && <GoalStats goals={goals} />}

      {/* Filters */}
      {!loading && <GoalFiltersBar filters={filters} onChange={setFilters} />}

      {/* Goal cards — employee CANNOT edit goal details, only view */}
      {!loading && !error && (
        filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Target size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-base font-medium">No goals assigned yet</p>
            <p className="text-sm mt-1">Your manager will assign goals here.</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onView={setViewGoal}
                onEdit={null}    /* employees cannot edit goal metadata */
                onDelete={null}  /* employees cannot delete goals */
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onView={setViewGoal}
                onEdit={null}
                onDelete={null}
              />
            ))}
          </div>
        )
      )}

      {/* Detail modal — employee CAN update progress and toggle milestones, but CANNOT add milestones */}
      <GoalDetailModal
        goal={viewGoal}
        open={!!viewGoal}
        onClose={() => setViewGoal(null)}
        onToggleMilestone={handleToggleMilestone}
        onAddMilestone={handleAddMilestone}
        onDeleteMilestone={handleDeleteMilestone}
        onAddComment={handleAddComment}
        onUpdateProgress={handleUpdateProgress}
        readOnlyProgress={false}
        canAddMilestone={false}    // employee CANNOT add milestones
        canToggleMilestone={true}  // employee CAN mark milestones complete
      />
    </div>
  );
}