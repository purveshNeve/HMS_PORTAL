import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default:
    "inline-flex items-center rounded-full bg-surface-raised px-2.5 py-1 text-xs font-semibold text-ink",
  neutral:
    "inline-flex items-center rounded-full bg-surface-subtle px-2.5 py-1 text-xs font-semibold text-ink-muted",
  success:
    "inline-flex items-center rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-700",
  warning:
    "inline-flex items-center rounded-full bg-warning-50 px-2.5 py-1 text-xs font-semibold text-warning-700",
  danger:
    "inline-flex items-center rounded-full bg-danger-50 px-2.5 py-1 text-xs font-semibold text-danger-700",
  brand:
    "inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700",
};

type BadgeVariants = keyof typeof badgeVariants;

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariants;
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return <span className={cn(badgeVariants[variant], className)} {...props} />;
}
