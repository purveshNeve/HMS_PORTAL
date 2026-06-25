"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ModuleTab, TabKey } from "@/types/feedback";
import { cn } from "@/lib/utils";

interface ModuleTabsProps {
  tabs: ModuleTab[];
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

export function ModuleTabs({ tabs, activeTab, onChange }: ModuleTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  const scrollBy = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div className="sticky top-0 z-30 bg-surface-raised border-b border-border">
      <div className="relative flex items-center">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollBy(-160)}
            aria-label="Scroll tabs left"
            className="absolute left-0 z-10 flex items-center h-full pl-2 pr-3 bg-gradient-to-r from-surface-raised via-surface-raised/95 to-transparent text-ink-muted hover:text-ink"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex items-stretch gap-0 overflow-x-auto no-scrollbar px-4 md:px-6"
        >
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onChange(tab.key)}
                className={cn(
                  "relative flex items-center gap-1.5 shrink-0 px-3 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap",
                  isActive
                    ? "text-brand-700 border-brand-600"
                    : "text-ink-muted border-transparent hover:text-ink hover:border-border-strong"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.label}
                {typeof tab.badge === "number" && tab.badge > 0 && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[11px] font-semibold leading-none",
                      isActive
                        ? "bg-brand-600 text-white"
                        : "bg-surface-subtle text-ink-muted border border-border"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollBy(160)}
            aria-label="Scroll tabs right"
            className="absolute right-0 z-10 flex items-center h-full pr-2 pl-3 bg-gradient-to-l from-surface-raised via-surface-raised/95 to-transparent text-ink-muted hover:text-ink"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
