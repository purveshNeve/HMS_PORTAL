"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Modal from "@/components/ui/Modal";
import ProgressBar from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import {
  Goal, STATUS_LABELS, STATUS_COLORS, PRIORITY_COLORS, CATEGORY_LABELS,
  GoalMilestone, GoalComment,
} from "@/lib/goals.types";
import {
  displayCommentAuthor,
  useGoalComments,
} from "@/lib/goalComments/goalCommentsClient";
import type { GoalCommentRole } from "@/lib/goalComments/goalComments.types";
import {
  CheckCircle2, Circle, Plus, Send, Trash2, CalendarDays, Tag, Wifi, WifiOff,
} from "lucide-react";

interface GoalDetailModalProps {
  goal: Goal | null;
  open: boolean;
  onClose: () => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onAddMilestone: (goalId: string, milestone: Omit<GoalMilestone, "id">) => void;
  onDeleteMilestone: (goalId: string, milestoneId: string) => void;
  onAddComment: (goalId: string, comment: GoalComment) => void;
  onUpdateProgress: (goalId: string, progress: number) => void;
  /** When true the progress slider is read-only (manager view) */
  readOnlyProgress?: boolean;
  /** When true the "Add milestone" button/form is shown (manager only) */
  canAddMilestone?: boolean;
  /** When true milestone checkboxes are interactive (employee only) */
  canToggleMilestone?: boolean;
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

const EMPTY_COMMENTS: GoalComment[] = [];

export default function GoalDetailModal({
  goal, open, onClose,
  onToggleMilestone, onAddMilestone, onDeleteMilestone,
  onAddComment, onUpdateProgress,
  readOnlyProgress = false,
  canAddMilestone = false,
  canToggleMilestone = true,
}: GoalDetailModalProps) {
  const [tab, setTab] = useState<"overview" | "milestones" | "comments">("overview");
  const [commentText, setCommentText] = useState("");
  const [newMilestone, setNewMilestone] = useState({ title: "", dueDate: "" });
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [progress, setProgress] = useState(goal?.progress ?? 0);

  const { data: session } = useSession();
  const userRole = (session?.user?.role ?? "employee") as GoalCommentRole;
  const userId = session?.user?.userId ?? "";
  const userName = session?.user?.name ?? (userRole === "manager" ? "Manager" : "Employee");

  const { comments, sendComment, connected, sending } = useGoalComments({
    goalId: goal?.id ?? null,
    open,
    initialComments: goal?.comments ?? EMPTY_COMMENTS,
    userRole,
    userId,
    userName,
    onCommentAdded: (comment) => {
      if (goal) onAddComment(goal.id, comment);
    },
  });

  if (!goal) return null;

  const handleAddComment = async () => {
    if (!commentText.trim() || sending) return;
    try {
      await sendComment(commentText.trim());
      setCommentText("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Could not send comment");
    }
  };

  const handleAddMilestone = () => {
    if (!newMilestone.title.trim() || !newMilestone.dueDate) return;
    onAddMilestone(goal.id, { ...newMilestone, completed: false });
    setNewMilestone({ title: "", dueDate: "" });
    setShowMilestoneForm(false);
  };

  const handleProgressSave = () => {
    onUpdateProgress(goal.id, progress);
  };

  const completedCount = goal.milestones.filter((m) => m.completed).length;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "milestones", label: `Milestones (${goal.milestones.length})` },
    { id: "comments", label: `Comments (${comments.length})` },
  ] as const;

  return (
    <Modal open={open} onClose={onClose} title={goal.title} size="xl">
      {/* Meta badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className={STATUS_COLORS[goal.status]}>{STATUS_LABELS[goal.status]}</Badge>
        <Badge className={PRIORITY_COLORS[goal.priority]}>
          {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} priority
        </Badge>
        <Badge className="bg-gray-100 text-gray-600">{CATEGORY_LABELS[goal.category]}</Badge>
        {goal.managerApproved && (
          <Badge className="bg-green-50 text-green-600">
            <CheckCircle2 size={10} className="mr-1" />Manager approved
          </Badge>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 mb-5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-sm px-4 py-2 font-medium border-b-2 transition -mb-px ${tab === t.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
            <p className="text-sm text-gray-700 leading-relaxed">{goal.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Start Date</p>
              <p className="text-sm text-gray-700 flex items-center gap-1.5">
                <CalendarDays size={13} className="text-gray-400" />{formatDate(goal.startDate)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Due Date</p>
              <p className="text-sm text-gray-700 flex items-center gap-1.5">
                <CalendarDays size={13} className="text-gray-400" />{formatDate(goal.dueDate)}
              </p>
            </div>
          </div>

          {/* Progress updater */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Progress</p>
            {readOnlyProgress ? (
              /* Manager view: read-only */
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-blue-500 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 w-10 text-right">{goal.progress}%</span>
              </div>
            ) : (
              /* Employee view: editable */
              <>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="range" min={0} max={100} step={5}
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-sm font-semibold text-gray-700 w-10 text-right">{progress}%</span>
                </div>
                <ProgressBar value={progress} status={goal.status} showLabel={false} height="h-3" />
                {progress !== goal.progress && (
                  <button
                    onClick={handleProgressSave}
                    className="mt-2 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                  >
                    Save progress
                  </button>
                )}
              </>
            )}
          </div>

          {/* Tags */}
          {goal.tags.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {goal.tags.map((t) => (
                  <span key={t} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    <Tag size={10} />#{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Milestone summary */}
          {goal.milestones.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Milestone Progress
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 bg-blue-500 rounded-full transition-all"
                    style={{ width: `${(completedCount / goal.milestones.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{completedCount}/{goal.milestones.length}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Milestones tab */}
      {tab === "milestones" && (
        <div className="space-y-3">
          {goal.milestones.length === 0 && !showMilestoneForm && (
            <p className="text-sm text-gray-400 text-center py-6">
              {canAddMilestone
                ? "No milestones yet. Add one below."
                : "No milestones have been added yet."}
            </p>
          )}

          {goal.milestones.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition">
              {/* Toggle: clickable for employee, static icon for manager */}
              {canToggleMilestone ? (
                <button
                  onClick={() => onToggleMilestone(goal.id, m.id)}
                  className="flex-shrink-0"
                  title="Mark complete"
                >
                  {m.completed
                    ? <CheckCircle2 size={18} className="text-green-500" />
                    : <Circle size={18} className="text-gray-300" />}
                </button>
              ) : (
                <span className="flex-shrink-0">
                  {m.completed
                    ? <CheckCircle2 size={18} className="text-green-500" />
                    : <Circle size={18} className="text-gray-300" />}
                </span>
              )}

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${m.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                  {m.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Due {formatDate(m.dueDate)}</p>
              </div>
              {/* Delete button hidden for both roles — no one can delete after creation */}
            </div>
          ))}

          {/* Add milestone form — manager only */}
          {canAddMilestone && showMilestoneForm && (
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3">
              <input
                className={inputClass}
                placeholder="Milestone title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone((p) => ({ ...p, title: e.target.value }))}
              />
              <input
                className={inputClass}
                type="date"
                value={newMilestone.dueDate}
                onChange={(e) => setNewMilestone((p) => ({ ...p, dueDate: e.target.value }))}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddMilestone}
                  className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowMilestoneForm(false)}
                  className="text-sm border border-gray-200 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {/* Add milestone button — manager only, not while form is open */}
          {canAddMilestone && !showMilestoneForm && (
            <button
              onClick={() => setShowMilestoneForm(true)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition font-medium"
            >
              <Plus size={15} /> Add milestone
            </button>
          )}
        </div>
      )}

      {/* Comments tab */}
      {tab === "comments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-end gap-1.5 text-xs text-gray-400">
            {connected ? (
              <>
                <Wifi size={12} className="text-green-500" />
                <span>Live</span>
              </>
            ) : (
              <>
                <WifiOff size={12} />
                <span>Offline — using HTTP fallback</span>
              </>
            )}
          </div>

          {comments.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">No comments yet.</p>
          )}
          <div className="space-y-3">
            {comments.map((c) => {
              const authorLabel = displayCommentAuthor(c, userRole);
              return (
                <div key={c.id} className={`rounded-lg px-4 py-3 text-sm ${authorLabel === "You" ? "bg-blue-50 ml-8" : "bg-gray-50 mr-8"
                  }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-600">{authorLabel}</span>
                    <span className="text-xs text-gray-400">{formatDate(c.date)}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{c.text}</p>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <input
              className={`${inputClass} flex-1`}
              placeholder="Write a comment…"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !sending && handleAddComment()}
              disabled={sending}
            />
            <button
              onClick={handleAddComment}
              disabled={sending || !commentText.trim()}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition flex-shrink-0 disabled:opacity-50"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
