"use client";

import { useCallback, useEffect, useState } from "react";

import type { Survey } from "../types";

export function useEmployeeRelations() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurveys = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { getActiveSurveys } = await import(
        "../services/employeeRelationsService"
      );
      const data = await getActiveSurveys();
      setSurveys(data);
    } catch {
      setError("Unable to load surveys.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSurveys();
  }, [fetchSurveys]);

  return { surveys, isLoading, error, refetch: fetchSurveys };
}
