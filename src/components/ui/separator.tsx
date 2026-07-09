import * as React from "react";
import { cn } from "@/lib/utils";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn(
        orientation === "vertical"
          ? "mx-3 h-full w-px bg-slate-200"
          : "my-3 h-px w-full bg-slate-200",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = "Separator";
