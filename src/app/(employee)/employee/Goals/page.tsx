"use client";

import { useState, useMemo } from "react";
import { useGoals } from "@/lib/useGoals";
import GoalStats from "@/components/goals/GoalStats";
import GoalCard from "@/components/goals/GoalCard";
import GoalDetailModal from "@/components/goals/GoalDetailModal";
import GoalFormModal from "@/components/goals/GoalFormModal";
import GoalFiltersBar, { GoalFilters } from "@/components/goals/GoalFiltersBar";
import { Goal, GoalMilestone } from "@/lib/goals.types";
import { Plus, LayoutGrid, List } from "lucide-react";

export default function EmployeeGoalPage() {
  const {
    goals, addGoal, updateGoal, deleteGoal,
    addMilestone, toggleMilestone, deleteMilestone,
    addComment, updateProgress,
  } = useGoals();

  const [viewGoal, setViewGoal] = useState<Goal | null>(null);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState<GoalFilters>({
    search: "", status: "", category: "", priority: "",
  });

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

  function handleEdit(goal: Goal) {
    setEditGoal(goal);
    setShowForm(true);
  }

  function handleSave(data: Omit<Goal, "id" | "comments" | "milestones">) {
    if (editGoal) {
      updateGoal(editGoal.id, data);
    } else {
      addGoal(data);
    }
    setEditGoal(null);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this goal? This cannot be undone.")) {
      deleteGoal(id);
      if (viewGoal?.id === id) setViewGoal(null);
    }
  }

  function handleUpdateProgress(goalId: string, progress: number) {
    updateProgress(goalId, progress);
    setViewGoal((g) => g?.id === goalId ? { ...g, progress } : g);
  }

  function handleToggleMilestone(goalId: string, milestoneId: string) {
    toggleMilestone(goalId, milestoneId);
    setViewGoal((g) => {
      if (!g || g.id !== goalId) return g;
      return {
        ...g,
        milestones: g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        ),
      };
    });
  }

  function handleAddMilestone(goalId: string, milestone: Omit<GoalMilestone, "id">) {
    addMilestone(goalId, milestone);
    const updated = goals.find((g) => g.id === goalId);
    if (updated) setViewGoal({ ...updated });
  }

  function handleDeleteMilestone(goalId: string, milestoneId: string) {
    deleteMilestone(goalId, milestoneId);
    setViewGoal((g) => {
      if (!g || g.id !== goalId) return g;
      return { ...g, milestones: g.milestones.filter((m) => m.id !== milestoneId) };
    });
  }

  function handleAddComment(goalId: string, text: string) {
    addComment(goalId, text);
    setViewGoal((g) => {
      if (!g || g.id !== goalId) return g;
      return {
        ...g,
        comments: [
          ...g.comments,
          { id: Date.now().toString(), author: "You", text, date: new Date().toISOString().split("T")[0] },
        ],
      };
    });
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Goals</h2>
          <p className="text-sm text-gray-400 mt-0.5">{goals.length} goals · {goals.filter(g => g.status === "completed").length} completed</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
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
          <button
            onClick={() => { setEditGoal(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            <Plus size={15} /> Add Goal
          </button>
        </div>
      </div>

      {/* Stats */}
      <GoalStats goals={goals} />

      {/* Filters */}
      <GoalFiltersBar filters={filters} onChange={setFilters} />

      {/* Grid / List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-base font-medium">No goals found</p>
          <p className="text-sm mt-1">Try adjusting filters or add a new goal.</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onView={setViewGoal}
              onEdit={handleEdit}
              onDelete={handleDelete}
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
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <GoalDetailModal
        goal={viewGoal}
        open={!!viewGoal}
        onClose={() => setViewGoal(null)}
        onToggleMilestone={handleToggleMilestone}
        onAddMilestone={handleAddMilestone}
        onDeleteMilestone={handleDeleteMilestone}
        onAddComment={handleAddComment}
        onUpdateProgress={handleUpdateProgress}
      />

      <GoalFormModal
        open={showForm}
        onClose={() => { setShowForm(false); setEditGoal(null); }}
        onSave={handleSave}
        initial={editGoal}
      />
    </div>
  );
}
