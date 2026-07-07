"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, GraduationCap, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardPage from "@/components/culturalDashboard/DashboardPage";
import SkillDevelopmentPage from "@/components/skillDevelopement/SkillDevelopmentPage";
import CulturalCalendarPage from "@/components/cultural-calender/CulturalCalendarPage";

type Tab = "dashboard" | "skill-development" | "cultural-calendar";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "skill-development", label: "Skill Development", icon: GraduationCap },
  { id: "cultural-calendar", label: "Cultural Calendar", icon: PartyPopper },
];

export default function CareerDevelopmentTabs() {
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="min-h-screen bg-paper">
      {/*
        NOTE: This nav is a lightweight stand-in for the existing admin portal's
        Career Development navbar, purely so this project can run standalone.
        Drop DashboardPage / SkillDevelopmentPage / CulturalCalendarPage into
        your real "Dashboard" / "Skill Development" / "Cultural Calendar" tabs
        instead of using this component.
      */}
      <div className="sticky top-0 z-30 border-b border-line bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-3 sm:px-6 lg:px-8">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-white" : "text-muted hover:text-ink"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="career-dev-tab-pill"
                    className="absolute inset-0 rounded-full bg-indigoink"
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {tab === "dashboard" && <DashboardPage />}
        {tab === "skill-development" && <SkillDevelopmentPage />}
        {tab === "cultural-calendar" && <CulturalCalendarPageWrapper />}
      </div>
    </div>
  );
}

// CulturalCalendarPage already renders its own <main> with padding; unwrap that
// here so spacing stays consistent with the other two tabs.
function CulturalCalendarPageWrapper() {
  return (
    <div className="-mx-4 -my-6 sm:-mx-6 lg:-mx-8">
      <CulturalCalendarPage />
    </div>
  );
}
