import { cn } from "@/lib/utils";
import * as React from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  status?: string;
  showLabel?: boolean;
  height?: string;
}

export default function Progress({ value, className, status, showLabel = false, height = "h-2", ...props }: ProgressProps) {
  const colorClass = status === "completed"
    ? "bg-emerald-500"
    : status === "at_risk"
      ? "bg-rose-500"
      : "bg-indigo-500";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative flex-1 overflow-hidden rounded-full bg-slate-100", height)} {...props}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && <span className="text-xs font-medium text-slate-600">{Math.round(value)}%</span>}
    </div>
  );
}
