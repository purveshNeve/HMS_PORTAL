"use client";

interface TooltipProps {
  name?: string;
  payload?: any[];
  label?: string;
  active?: boolean;
}

export function ChartTooltip({ active, payload, label }:
  TooltipProps
) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl border border-ink-100 bg-white/95 px-3.5 py-2.5 text-xs shadow-lift backdrop-blur dark:border-ink-700 dark:bg-surface-darkcard/95">
      {label && <p className="mb-1.5 font-mono text-[10px] uppercase tracking-wide text-ink-400">{label}</p>}
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-ink-500 dark:text-ink-300">{entry.name}:</span>
            <span className="font-semibold text-ink-800 dark:text-ink-100">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


// TooltipProps<number, string>