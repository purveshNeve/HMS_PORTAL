"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import GoalStats from "@/components/goals/GoalStats";
import GoalCard from "@/components/goals/GoalCard";
import GoalDetailModal from "@/components/goals/GoalDetailModal";
import GoalFormModal from "@/components/goals/GoalFormModal";
import GoalFiltersBar, { GoalFilters } from "@/components/goals/GoalFiltersBar";
import { Goal, GoalMilestone, GoalComment } from "@/lib/goals.types";
import { Plus, LayoutGrid, List, Loader2 } from "lucide-react";

export default function ManagerGoalPage() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [viewGoal, setViewGoal] = useState<Goal | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [view, setView] = useState<"grid" | "list">("grid");

    const [filters, setFilters] = useState<GoalFilters>({
        search: "", status: "", category: "", priority: "",
    });

    // Fetch goals created by this manager
    const loadGoals = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/goals");
            if (!res.ok) throw new Error("Failed to load goals");
            const data = await res.json();
            // normalise _id -> id
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

    // After manager creates a goal, add it to local state
    function handleGoalCreated(goal: Goal) {
        setGoals((prev) => [goal, ...prev]);
    }

    function handleToggleMilestone(goalId: string, milestoneId: string) {
        setGoals((prev) =>
            prev.map((g) =>
                g.id === goalId
                    ? {
                        ...g,
                        milestones: g.milestones.map((m) =>
                            m.id === milestoneId ? { ...m, completed: !m.completed } : m
                        ),
                    }
                    : g
            )
        );
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

    async function handleAddMilestone(goalId: string, milestone: Omit<GoalMilestone, "id">) {
        try {
            const res = await fetch(`/api/goals/${goalId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "addMilestone", milestone }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to add milestone");
            }
            const data = await res.json();
            // Use the server-returned milestone (has the canonical id)
            const savedMilestone: GoalMilestone = data.milestone ?? { ...milestone, id: Date.now().toString() };
            setGoals((prev) =>
                prev.map((g) =>
                    g.id === goalId ? { ...g, milestones: [...g.milestones, savedMilestone] } : g
                )
            );
            setViewGoal((g) =>
                g?.id === goalId ? { ...g, milestones: [...g.milestones, savedMilestone] } : g
            );
        } catch (e) {
            alert(e instanceof Error ? e.message : "Could not add milestone");
        }
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

    // Manager cannot update progress — no-op
    function handleUpdateProgress(_goalId: string, _progress: number) { /* read-only for manager */ }

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Team Goals</h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {loading ? "Loading…" : `${goals.length} goals assigned · ${goals.filter(g => g.status === "completed").length} completed`}
                    </p>
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
                    {/* Manager CAN add goals */}
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        <Plus size={15} /> Add Goal
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

            {/* Grid / List — edit button DISABLED for manager */}
            {!loading && !error && (
                filtered.length === 0 ? (
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
                                onEdit={null}   /* manager cannot edit after creation */
                                onDelete={null} /* keep null to hide delete too */
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

            {/* Detail modal — progress slider read-only for manager, milestones addable but not editable */}
            <GoalDetailModal
                goal={viewGoal}
                open={!!viewGoal}
                onClose={() => setViewGoal(null)}
                onToggleMilestone={handleToggleMilestone}
                onAddMilestone={handleAddMilestone}
                onDeleteMilestone={handleDeleteMilestone}
                onAddComment={handleAddComment}
                onUpdateProgress={handleUpdateProgress}
                readOnlyProgress
                canAddMilestone    // manager CAN add milestones
                canToggleMilestone={false}  // manager CANNOT toggle (edit) milestones
            />

            {/* Add Goal form (manager only) */}
            <GoalFormModal
                open={showForm}
                onClose={() => setShowForm(false)}
                onSave={handleGoalCreated}
                initial={null}
            />
        </div>
    );
}