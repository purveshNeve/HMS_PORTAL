import * as React from "react";
import { cn } from "@/lib/utils";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("overflow-auto", className)}
      style={{ ...style }}
      {...props}
    />
  )
);
ScrollArea.displayName = "ScrollArea";
