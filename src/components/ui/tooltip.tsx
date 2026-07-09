import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProviderProps {
  delayDuration?: number;
  children: React.ReactNode;
}

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  delayDuration: number;
}

const TooltipProviderContext = React.createContext<{ delayDuration: number }>({ delayDuration: 0 });
const TooltipContext = React.createContext<TooltipContextValue | null>(null);

export function TooltipProvider({ delayDuration = 0, children }: TooltipProviderProps) {
  return (
    <TooltipProviderContext.Provider value={{ delayDuration }}>
      {children}
    </TooltipProviderContext.Provider>
  );
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const provider = React.useContext(TooltipProviderContext);

  return (
    <TooltipContext.Provider value={{ open, setOpen, delayDuration: provider.delayDuration }}>
      <div className="relative inline-flex">{children}</div>
    </TooltipContext.Provider>
  );
}

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children: React.ReactElement;
}

export function TooltipTrigger({ asChild, children }: TooltipTriggerProps) {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("TooltipTrigger must be used within Tooltip");
  }

  const openTooltip = () => context.setOpen(true);
  const closeTooltip = () => context.setOpen(false);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onMouseEnter: (event: React.MouseEvent) => {
        openTooltip();
        children.props.onMouseEnter?.(event);
      },
      onMouseLeave: (event: React.MouseEvent) => {
        closeTooltip();
        children.props.onMouseLeave?.(event);
      },
      onFocus: (event: React.FocusEvent) => {
        openTooltip();
        children.props.onFocus?.(event);
      },
      onBlur: (event: React.FocusEvent) => {
        closeTooltip();
        children.props.onBlur?.(event);
      },
    });
  }

  return (
    <span onMouseEnter={openTooltip} onMouseLeave={closeTooltip} onFocus={openTooltip} onBlur={closeTooltip}>
      {children}
    </span>
  );
}

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function TooltipContent({ className, ...props }: TooltipContentProps) {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error("TooltipContent must be used within Tooltip");
  }

  if (!context.open) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute left-1/2 top-full z-50 mt-2 w-max -translate-x-1/2 rounded-lg border border-slate-200 bg-slate-950/95 px-3 py-2 text-xs text-white shadow-lg",
        className
      )}
      {...props}
    />
  );
}
