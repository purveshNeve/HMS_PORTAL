// lib/use-dashboard-section.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DashboardSection, DashboardSectionMap } from "@/types/admindashboard";
import { fetchDashboardSection } from "./dashboard-api";

interface UseDashboardSectionResult<S extends DashboardSection> {
  data: DashboardSectionMap[S] | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Loads one dashboard section, exposing loading / error / refetch so every
 * card, chart, and table can render its own skeleton or empty/error state
 * independently (a slow payroll query shouldn't block the KPI cards).
 */
export function useDashboardSection<S extends DashboardSection>(
  section: S,
  refreshKey?: number
): UseDashboardSectionResult<S> {
  const [data, setData] = useState<DashboardSectionMap[S] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);

  const load = useCallback(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    fetchDashboardSection(section, controller.signal)
      .then((result) => {
        setData(result);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setIsLoading(false);
      });
  }, [section]);

  useEffect(() => {
    load();
    return () => controllerRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, refreshKey, tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { data, isLoading, error, refetch };
}
