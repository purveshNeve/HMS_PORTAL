import { cn } from "@/lib/utils";
import * as React from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export default function Progress({ value, className, ...props }: ProgressProps) {
  return (
    <div className={cn("relative h-2 overflow-hidden rounded-full bg-slate-100", className)} {...props}>
      <div
        className="h-full rounded-full bg-indigo-500 transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
