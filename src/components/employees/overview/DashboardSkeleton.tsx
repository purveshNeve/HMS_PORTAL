"use client";

export function SkeletonCard({ h = "h-32" }: { h?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50 ${h}`} />
  );
}

export function SkeletonText({ w = "w-full" }: { w?: string }) {
  return (
    <div className={`h-3.5 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800 ${w}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <SkeletonText w="w-64" />
        <SkeletonText w="w-40" />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} h="h-28" />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} h="h-72" />
        ))}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} h="h-48" />
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <SkeletonCard h="h-64" />
        <SkeletonCard h="h-64" />
      </div>
    </div>
  );
}
