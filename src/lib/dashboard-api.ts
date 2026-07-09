// lib/dashboard-api.ts
// Thin typed client around GET /api/dashboard?section=...
// Swap the base fetch here if you move to react-query/SWR later — the hook
// (use-dashboard-section.ts) is the only other place that depends on this.

import type { DashboardSection, DashboardSectionMap } from "@/types/admindashboard";

export async function fetchDashboardSection<S extends DashboardSection>(
  section: S,
  signal?: AbortSignal
): Promise<DashboardSectionMap[S]> {
  const res = await fetch(`/api/adminDashboard?section=${section}`, {
    signal,
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Failed to load "${section}" (${res.status})`);
  }

  return res.json();
}
