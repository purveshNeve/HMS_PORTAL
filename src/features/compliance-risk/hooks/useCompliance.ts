"use client";

import { useCallback, useEffect, useState } from "react";

import type { Policy } from "../types";

export function useCompliance() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { getActivePolicies } = await import("../services/complianceService");
      const data = await getActivePolicies();
      setPolicies(data);
    } catch {
      setError("Unable to load policies.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPolicies();
  }, [fetchPolicies]);

  return { policies, isLoading, error, refetch: fetchPolicies };
}
