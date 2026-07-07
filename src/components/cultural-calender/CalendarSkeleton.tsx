export default function CalendarSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[152px] animate-pulse rounded-xl2 border border-line bg-line/40"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="h-[560px] animate-pulse rounded-xl2 border border-line bg-line/30" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl2 border border-line bg-line/30"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
