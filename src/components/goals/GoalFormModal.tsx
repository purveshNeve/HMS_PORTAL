"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import {
  Goal, GoalStatus, GoalCategory, GoalPriority,
  STATUS_LABELS, CATEGORY_LABELS,
} from "@/lib/goals.types";

interface GoalFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Goal, "id" | "comments" | "milestones">) => void;
  initial?: Goal | null;
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white";

const BLANK = {
  title: "",
  description: "",
  category: "performance" as GoalCategory,
  status: "not_started" as GoalStatus,
  priority: "medium" as GoalPriority,
  progress: 0,
  startDate: new Date().toISOString().split("T")[0],
  dueDate: "",
  tags: [] as string[],
  managerApproved: false,
};

export default function GoalFormModal({ open, onClose, onSave, initial }: GoalFormModalProps) {
  const [form, setForm] = useState(BLANK);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        description: initial.description,
        category: initial.category,
        status: initial.status,
        priority: initial.priority,
        progress: initial.progress,
        startDate: initial.startDate,
        dueDate: initial.dueDate,
        tags: initial.tags,
        managerApproved: initial.managerApproved,
      });
    } else {
      setForm(BLANK);
    }
    setErrors({});
    setTagInput("");
  }, [initial, open]);

  function set(key: string, value: unknown) {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.dueDate) e.dueDate = "Due date is required";
    if (form.startDate && form.dueDate && form.startDate > form.dueDate)
      e.dueDate = "Due date must be after start date";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave(form);
    onClose();
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    set("tags", form.tags.filter((t) => t !== tag));
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Edit Goal" : "Add New Goal"} size="lg">
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
            Goal Title *
          </label>
          <input
            className={inputClass}
            placeholder="e.g. Complete AWS certification"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
            Description
          </label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={3}
            placeholder="Describe what you want to achieve…"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>

        {/* Category + Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Category
            </label>
            <select
              className={inputClass}
              value={form.category}
              onChange={(e) => set("category", e.target.value as GoalCategory)}
            >
              {(Object.keys(CATEGORY_LABELS) as GoalCategory[]).map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Priority
            </label>
            <select
              className={inputClass}
              value={form.priority}
              onChange={(e) => set("priority", e.target.value as GoalPriority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Status + Progress */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Status
            </label>
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => set("status", e.target.value as GoalStatus)}
            >
              {(Object.keys(STATUS_LABELS) as GoalStatus[]).map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Progress: {form.progress}%
            </label>
            <input
              type="range" min={0} max={100} step={5}
              value={form.progress}
              onChange={(e) => set("progress", Number(e.target.value))}
              className="w-full mt-2 accent-blue-600"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Start Date
            </label>
            <input
              type="date" className={inputClass}
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Due Date *
            </label>
            <input
              type="date" className={inputClass}
              value={form.dueDate}
              onChange={(e) => set("dueDate", e.target.value)}
            />
            {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
            Tags
          </label>
          <div className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              placeholder="e.g. react, certification"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            />
            <button
              type="button"
              onClick={addTag}
              className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
            >
              Add
            </button>
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {form.tags.map((t) => (
                <span key={t} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  #{t}
                  <button onClick={() => removeTag(t)} className="text-gray-400 hover:text-gray-700 ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 mt-2">
          <button
            onClick={onClose}
            className="text-sm border border-gray-200 px-5 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="text-sm bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {initial ? "Save changes" : "Create goal"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
