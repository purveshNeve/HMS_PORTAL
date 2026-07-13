import * as React from "react";
import { cn } from "@/lib/utils";

interface HoverCardContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const HoverCardContext = React.createContext<HoverCardContextValue | null>(null);

export function HoverCard({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = React.useState(false);

  return (
    <HoverCardContext.Provider value={{ open, setOpen }}>
      <div
        className={cn("relative inline-flex", className)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </div>
    </HoverCardContext.Provider>
  );
}

interface HoverCardTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children: React.ReactElement;
}

export function HoverCardTrigger({ asChild, children }: HoverCardTriggerProps) {
  const context = React.useContext(HoverCardContext);
  if (!context) {
    throw new Error("HoverCardTrigger must be used within HoverCard");
  }

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as React.HTMLAttributes<HTMLElement> & {
      onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
      onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
    };

    return React.cloneElement(children as React.ReactElement<any>, {
      onFocus: (event: React.FocusEvent<HTMLElement>) => {
        context.setOpen(true);
        childProps.onFocus?.(event);
      },
      onBlur: (event: React.FocusEvent<HTMLElement>) => {
        context.setOpen(false);
        childProps.onBlur?.(event);
      },
    });
  }

  return (
    <button
      type="button"
      onFocus={() => context.setOpen(true)}
      onBlur={() => context.setOpen(false)}
    >
      {children}
    </button>
  );
}

interface HoverCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function HoverCardContent({ className, ...props }: HoverCardContentProps) {
  const context = React.useContext(HoverCardContext);
  if (!context) {
    throw new Error("HoverCardContent must be used within HoverCard");
  }

  if (!context.open) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute left-1/2 top-full z-50 mt-2 w-max -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-lg",
        className
      )}
      {...props}
    />
  );
}
