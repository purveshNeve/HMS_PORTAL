"use client";

import { useState, useCallback } from "react";
import { Goal, GoalMilestone, GoalComment, DEFAULT_GOALS } from "./goals.types";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);

  const addGoal = useCallback((goal: Omit<Goal, "id" | "comments" | "milestones">) => {
    setGoals((prev) => [
      ...prev,
      { ...goal, id: uid(), comments: [], milestones: [] },
    ]);
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const addMilestone = useCallback((goalId: string, milestone: Omit<GoalMilestone, "id">) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, milestones: [...g.milestones, { ...milestone, id: uid() }] }
          : g
      )
    );
  }, []);

  const toggleMilestone = useCallback((goalId: string, milestoneId: string) => {
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
  }, []);

  const deleteMilestone = useCallback((goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, milestones: g.milestones.filter((m) => m.id !== milestoneId) }
          : g
      )
    );
  }, []);

  const addComment = useCallback((goalId: string, text: string) => {
    const comment: GoalComment = {
      id: uid(),
      author: "You",
      text,
      date: new Date().toISOString().split("T")[0],
    };
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, comments: [...g.comments, comment] } : g
      )
    );
  }, []);

  const updateProgress = useCallback((goalId: string, progress: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, progress } : g))
    );
  }, []);

  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    addMilestone,
    toggleMilestone,
    deleteMilestone,
    addComment,
    updateProgress,
  };
}
