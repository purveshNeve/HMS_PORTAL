import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { SummaryMetric } from "@/types/feedback";
import { cn } from "@/lib/utils";

const deltaColor: Record<string, string> = {
  up: "text-success-600",
  down: "text-danger-600",
  flat: "text-ink-faint",
};

const DeltaIcon = { up: ArrowUp, down: ArrowDown, flat: Minus };

export function SummaryMetricCard({ metric }: { metric: SummaryMetric }) {
  const Icon = metric.deltaDirection ? DeltaIcon[metric.deltaDirection] : null;
  return (
    <div className="bg-surface-raised border border-border rounded-md p-3 shadow-card">
      <p className="text-xs font-medium text-ink-muted uppercase tracking-wide">{metric.label}</p>
      <div className="flex items-baseline gap-2 mt-1.5">
        <span className="text-2xl font-semibold text-ink tracking-tight">{metric.value}</span>
        {metric.delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              metric.deltaDirection ? deltaColor[metric.deltaDirection] : "text-ink-faint"
            )}
          >
            {Icon && <Icon size={11} strokeWidth={2.5} />}
            {metric.delta}
          </span>
        )}
      </div>
      <p className="text-xs text-ink-faint mt-1">{metric.helpText}</p>
    </div>
  );
}
