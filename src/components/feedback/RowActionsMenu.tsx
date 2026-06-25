"use client";

import { MoreHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ActionItem {
  label: string;
  icon: React.ElementType;
  destructive?: boolean;
  onClick?: () => void;
}

export function RowActionsMenu({ actions }: { actions: ActionItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-7 h-7 rounded-md text-ink-faint hover:bg-surface-subtle hover:text-ink transition-colors"
        aria-label="Row actions"
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-surface-raised border border-border rounded-md shadow-popover z-40 overflow-hidden py-1">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                onClick={() => {
                  action.onClick?.();
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left hover:bg-surface-subtle transition-colors",
                  action.destructive ? "text-danger-600" : "text-ink"
                )}
              >
                <Icon size={13} strokeWidth={1.8} />
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
