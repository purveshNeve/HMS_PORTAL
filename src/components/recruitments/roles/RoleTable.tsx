"use client";

import { Pencil, Copy, Archive, Lock, Trash2 } from "lucide-react";
import { JobRole } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { formatCurrency } from "@/lib/utils";

export function RoleTable({
  roles,
  onEdit,
  onDuplicate,
  onArchive,
  onCloseHiring,
  onDelete,
}: {
  roles: JobRole[];
  onEdit: (r: JobRole) => void;
  onDuplicate: (r: JobRole) => void;
  onArchive: (r: JobRole) => void;
  onCloseHiring: (r: JobRole) => void;
  onDelete: (r: JobRole) => void;
}) {
  return (
    <div className="card-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 bg-ink-50/60 text-[11px] uppercase tracking-wide text-ink-400 dark:border-ink-700 dark:bg-ink-800/40">
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Manager</th>
              <th className="px-4 py-3 font-medium">Openings</th>
              <th className="px-4 py-3 font-medium">Applications</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Salary</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-ink-700">
            {roles.map((role) => (
              <tr key={role.id} className="transition-colors hover:bg-ink-50/60 dark:hover:bg-ink-800/40">
                <td className="px-5 py-3.5">
                  <p className="font-medium text-ink-800 dark:text-ink-100">{role.title}</p>
                  <p className="text-xs text-ink-400">{role.department} · {role.location}</p>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <img src={role.managerAvatar} alt="" className="h-6 w-6 rounded-full object-cover" />
                    <span className="text-xs text-ink-500 dark:text-ink-300">{role.hiringManager}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">
                  {role.filled}/{role.openings}
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">{role.applications}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={role.priority} />
                </td>
                <td className="px-4 py-3.5 font-mono text-xs text-ink-600 dark:text-ink-300">
                  {formatCurrency(role.salaryMin)}–{formatCurrency(role.salaryMax)}
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={role.status} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <ActionMenu
                    items={[
                      { label: "Edit Role", icon: Pencil, onClick: () => onEdit(role) },
                      { label: "Duplicate Role", icon: Copy, onClick: () => onDuplicate(role) },
                      { label: "Close Hiring", icon: Lock, onClick: () => onCloseHiring(role) },
                      { label: "Archive Role", icon: Archive, onClick: () => onArchive(role) },
                      { label: "Delete Role", icon: Trash2, onClick: () => onDelete(role), danger: true },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
