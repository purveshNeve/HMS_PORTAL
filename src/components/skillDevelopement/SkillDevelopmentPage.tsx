"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookMarked, Grid3x3, ShieldCheck, Construction } from "lucide-react";
import { cn } from "@/lib/utils";
import LearningProgramsView from "@/components/skillDevelopement/LearningProgramsView";
import SkillMatrixView from "@/components/skillDevelopement/SkillMatrixView";
import CertificationsView from "@/components/skillDevelopement/CertificationsView";

type SubModule = "programs" | "matrix" | "certifications";

const SUB_MODULES: { id: SubModule; label: string; icon: React.ElementType }[] = [
  { id: "programs", label: "Learning Programs", icon: BookMarked },
  { id: "matrix", label: "Employee Skill Matrix", icon: Grid3x3 },
  { id: "certifications", label: "Certification Management", icon: ShieldCheck },
];

const COMING_SOON = ["Course Library", "Training Sessions", "Learning Path"];

export default function SkillDevelopmentPage() {
  const [active, setActive] = useState<SubModule>("programs");

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Skill Development
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          Manage learning programs, track employee skill gaps, and oversee certifications.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-line pb-4">
        {SUB_MODULES.map((mod) => {
          const Icon = mod.icon;
          const isActive = active === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => setActive(mod.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive ? "text-white" : "text-muted hover:text-ink"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="skill-dev-tab-pill"
                  className="absolute inset-0 rounded-full bg-indigoink"
                  transition={{ type: "spring", duration: 0.4 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {mod.label}
              </span>
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-[11px] text-muted">
          <Construction className="h-3 w-3" />
          Coming soon: {COMING_SOON.join(" · ")}
        </div>
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {active === "programs" && <LearningProgramsView />}
        {active === "matrix" && <SkillMatrixView />}
        {active === "certifications" && <CertificationsView />}
      </motion.div>
    </div>
  );
}
