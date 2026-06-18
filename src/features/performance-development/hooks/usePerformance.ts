"use client";

import { useCallback, useEffect, useState } from "react";

import type { Goal } from "../types";

export function usePerformance(employeeId: string) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!employeeId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { getGoalsByEmployee } = await import("../services/performanceService");
      const data = await getGoalsByEmployee(employeeId);
      setGoals(data);
    } catch {
      setError("Unable to load goals.");
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    void fetchGoals();
  }, [fetchGoals]);

  return { goals, isLoading, error, refetch: fetchGoals };
}
