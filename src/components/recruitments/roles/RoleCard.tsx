"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Users,
  Briefcase,
  Pencil,
  Copy,
  Archive,
  Lock,
  Trash2,
  Globe2,
} from "lucide-react";
import { JobRole } from "@/lib/types";
import StatusBadge from "@/components/ui/StatusBadge";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { formatCurrency } from "@/lib/utils";

const priorityDot: Record<string, string> = {
  Critical: "bg-coral-500",
  High: "bg-gold-500",
  Medium: "bg-sky-500",
  Low: "bg-ink-300",
};

export function RoleCard({
  role,
  index,
  onEdit,
  onDuplicate,
  onArchive,
  onCloseHiring,
  onDelete,
}: {
  role: JobRole;
  index: number;
  onEdit: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onCloseHiring: () => void;
  onDelete: () => void;
}) {
  const fillPct = Math.round((role.filled / role.openings) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.35 }}
      whileHover={{ y: -3 }}
      className="card-surface group flex flex-col p-5 transition-shadow hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${priorityDot[role.priority]}`} />
            <span className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
              {role.priority} priority
            </span>
          </div>
          <h3 className="truncate font-display text-[17px] font-semibold text-ink-900 dark:text-ink-50">
            {role.title}
          </h3>
          <p className="text-xs text-ink-400">{role.department}</p>
        </div>
        <ActionMenu
          items={[
            { label: "Edit Role", icon: Pencil, onClick: onEdit },
            { label: "Duplicate Role", icon: Copy, onClick: onDuplicate },
            { label: "Close Hiring", icon: Lock, onClick: onCloseHiring },
            { label: "Archive Role", icon: Archive, onClick: onArchive },
            { label: "Delete Role", icon: Trash2, onClick: onDelete, danger: true },
          ]}
        />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <img src={role.managerAvatar} alt={role.hiringManager} className="h-6 w-6 rounded-full object-cover" />
        <span className="text-xs text-ink-500 dark:text-ink-300">{role.hiringManager}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {role.skills.slice(0, 3).map((s) => (
          <span key={s} className="chip bg-ink-50 text-ink-500 dark:bg-ink-700 dark:text-ink-300">
            {s}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-ink-500 dark:text-ink-300">
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-ink-300" />
          <span className="truncate">{role.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase size={13} className="text-ink-300" />
          <span>{role.employmentType}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Users size={13} className="text-ink-300" />
          <span>{role.applications} applicants</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe2 size={13} className="text-ink-300" />
          <span>{role.remote ? "Remote OK" : "On-site"}</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-[11px] text-ink-400">
          <span>
            {role.filled}/{role.openings} filled
          </span>
          <span>{role.experience}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-50 dark:bg-ink-800">
          <div
            className="h-full rounded-full bg-evergreen-600"
            style={{ width: `${Math.min(fillPct, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4 dark:border-ink-700">
        <span className="font-mono text-xs font-semibold text-ink-700 dark:text-ink-200">
          {formatCurrency(role.salaryMin)} – {formatCurrency(role.salaryMax)}
        </span>
        <StatusBadge status={role.status} />
      </div>
    </motion.div>
  );
}
