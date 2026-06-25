import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}

const variantClasses: Record<string, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 border border-brand-600",
  secondary: "bg-surface-raised text-ink border border-border hover:bg-surface-subtle",
  ghost: "bg-transparent text-ink-muted hover:bg-surface-subtle border border-transparent",
  danger: "bg-surface-raised text-danger-600 border border-danger-500/30 hover:bg-danger-50",
};

const sizeClasses: Record<string, string> = {
  sm: "h-7 px-2.5 text-xs",
  md: "h-8 px-3 text-sm",
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
