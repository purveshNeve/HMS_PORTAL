import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = {
  default:
    "inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
  secondary:
    "inline-flex items-center justify-center rounded-lg bg-surface-raised px-4 py-2 text-sm font-semibold text-ink shadow-sm ring-1 ring-border transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
  ghost:
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
  destructive:
    "inline-flex items-center justify-center rounded-lg bg-danger-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-danger-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
};

type ButtonVariants = keyof typeof buttonVariants;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const sizeClasses =
      size === "sm"
        ? "h-9 px-3 text-xs"
        : size === "lg"
        ? "h-12 px-6 text-base"
        : "h-10 px-4 text-sm";

    return (
      <button
        ref={ref}
        className={cn(buttonVariants[variant], sizeClasses, className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
