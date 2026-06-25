export function HorizontalBarChart({
  data,
}: {
  data: { category: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.category} className="flex items-center gap-3">
          <span className="text-xs text-ink-muted w-32 shrink-0 truncate">{d.category}</span>
          <div className="flex-1 h-2 rounded-full bg-surface-subtle overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="text-xs text-ink-faint w-8 text-right shrink-0">{d.value}%</span>
        </div>
      ))}
    </div>
  );
}
