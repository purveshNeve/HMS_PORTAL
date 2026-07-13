import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

export function DropdownMenu({ children }: React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={menuRef} className="relative inline-block">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children: React.ReactElement;
}

export function DropdownMenuTrigger({ asChild, children }: DropdownMenuTriggerProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenuTrigger must be used within DropdownMenu");
  }

  const toggle = (event: React.MouseEvent) => {
    event.preventDefault();
    context.setOpen(!context.open);
  };

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as React.HTMLAttributes<HTMLElement> & { onClick?: (event: React.MouseEvent<HTMLElement>) => void };

    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (event: React.MouseEvent<HTMLElement>) => {
        toggle(event);
        childProps.onClick?.(event);
      },
    });
  }

  return (
    <button type="button" onClick={toggle}>
      {children}
    </button>
  );
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end" | "center";
}

export function DropdownMenuContent({
  className,
  align = "start",
  ...props
}: DropdownMenuContentProps) {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenuContent must be used within DropdownMenu");
  }

  if (!context.open) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-[12rem] rounded-xl border border-slate-200 bg-white p-1 shadow-lg",
        align === "end" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuItem({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100",
        className
      )}
      {...props}
    />
  );
}
