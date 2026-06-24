"use client";

import { Goal, STATUS_LABELS, STATUS_COLORS, PRIORITY_COLORS, CATEGORY_LABELS } from "@/lib/goals.types";
import { Badge } from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { CheckCircle2, AlertCircle, Trash2, Pencil, MessageSquare, Target } from "lucide-react";

interface GoalCardProps {
  goal: Goal;
  onView: (goal: Goal) => void;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function daysLeft(dueDate: string) {
  const diff = Math.ceil(
    (new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return { label: `${Math.abs(diff)}d overdue`, color: "text-red-500" };
  if (diff === 0) return { label: "Due today", color: "text-amber-500" };
  if (diff <= 7) return { label: `${diff}d left`, color: "text-amber-500" };
  return { label: `${diff}d left`, color: "text-gray-400" };
}

export default function GoalCard({ goal, onView, onEdit, onDelete }: GoalCardProps) {
  const due = daysLeft(goal.dueDate);
  const completedMilestones = goal.milestones.filter((m) => m.completed).length;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group"
      onClick={() => onView(goal)}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <Target size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
              {goal.title}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{CATEGORY_LABELS[goal.category]}</p>
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(goal)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge className={STATUS_COLORS[goal.status]}>{STATUS_LABELS[goal.status]}</Badge>
        <Badge className={PRIORITY_COLORS[goal.priority]}>
          {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} priority
        </Badge>
        {goal.managerApproved && (
          <Badge className="bg-green-50 text-green-600">
            <CheckCircle2 size={10} className="mr-1" /> Approved
          </Badge>
        )}
        {goal.status === "at_risk" && (
          <Badge className="bg-red-50 text-red-500">
            <AlertCircle size={10} className="mr-1" /> At Risk
          </Badge>
        )}
      </div>

      {/* Progress */}
      <div className="mb-3">
        <ProgressBar value={goal.progress} status={goal.status} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
        <div className="flex items-center gap-3">
          <span>Due {formatDate(goal.dueDate)}</span>
          {goal.milestones.length > 0 && (
            <span>{completedMilestones}/{goal.milestones.length} milestones</span>
          )}
          {goal.comments.length > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare size={11} />{goal.comments.length}
            </span>
          )}
        </div>
        <span className={`font-medium ${due.color}`}>{due.label}</span>
      </div>

      {/* Tags */}
      {goal.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5 pt-2.5 border-t border-gray-100">
          {goal.tags.map((t) => (
            <span key={t} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
