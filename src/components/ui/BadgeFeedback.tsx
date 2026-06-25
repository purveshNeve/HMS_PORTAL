import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "neutral" | "brand" | "success" | "warning" | "danger";
  className?: string;
}

const variantClasses: Record<string, string> = {
  neutral: "bg-surface-subtle text-ink-muted border-border",
  brand: "bg-brand-50 text-brand-700 border-brand-200",
  success: "bg-success-50 text-success-600 border-success-500/20",
  warning: "bg-warning-50 text-warning-600 border-warning-500/20",
  danger: "bg-danger-50 text-danger-600 border-danger-500/20",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-xs font-medium leading-none",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
