"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { LearningProgram, ProgramLevel, ProgramStatus } from "@/types/skill-development";
import { programCategories, departments } from "@/data/skillDevelopmentData";
import Drawer from "@/components/ui/Drawer";
import { TextField, TextareaField, SelectField } from "@/components/ui/FormFields";

const LEVELS: ProgramLevel[] = ["Beginner", "Intermediate", "Advanced"];
const STATUSES: ProgramStatus[] = ["Draft", "Active", "Completed", "Archived"];

const emptyForm = {
  name: "",
  description: "",
  category: programCategories[0],
  duration: "",
  level: "Beginner" as ProgramLevel,
  department: departments[0],
  instructor: "",
  resources: "",
  assignments: "",
  status: "Draft" as ProgramStatus,
};

export default function ProgramFormDrawer({
  open,
  onClose,
  initial,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initial: LearningProgram | null;
  onSave: (program: LearningProgram) => void;
}) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        description: initial.description,
        category: initial.category,
        duration: initial.duration,
        level: initial.level,
        department: initial.department,
        instructor: initial.instructor,
        resources: String(initial.resources),
        assignments: String(initial.assignments),
        status: initial.status,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initial, open]);

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Program name is required.";
    if (!form.duration.trim()) nextErrors.duration = "Duration is required.";
    if (!form.instructor.trim()) nextErrors.instructor = "Instructor is required.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      id: initial?.id ?? `prog-${Math.random().toString(36).slice(2, 8)}`,
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      duration: form.duration.trim(),
      level: form.level,
      department: form.department,
      instructor: form.instructor.trim(),
      resources: Number(form.resources) || 0,
      assignments: Number(form.assignments) || 0,
      progress: initial?.progress ?? 0,
      status: form.status,
    });
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={initial ? "Edit Learning Program" : "Create Learning Program"}
      description="Programs appear in the Learning Programs library once saved."
    >
      <TextField
        label="Program Name"
        placeholder="e.g. Advanced React Patterns"
        value={form.name}
        error={errors.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <TextareaField
        label="Description"
        placeholder="Short summary of what this program covers"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {programCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </SelectField>
        <SelectField
          label="Level"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value as ProgramLevel })}
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </SelectField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Duration"
          placeholder="e.g. 4 weeks"
          value={form.duration}
          error={errors.duration}
          onChange={(e) => setForm({ ...form, duration: e.target.value })}
        />
        <SelectField
          label="Department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        >
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </SelectField>
      </div>
      <TextField
        label="Instructor"
        placeholder="e.g. Sana Kapoor"
        value={form.instructor}
        error={errors.instructor}
        onChange={(e) => setForm({ ...form, instructor: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="Resources"
          type="number"
          min={0}
          value={form.resources}
          onChange={(e) => setForm({ ...form, resources: e.target.value })}
        />
        <TextField
          label="Assignments"
          type="number"
          min={0}
          value={form.assignments}
          onChange={(e) => setForm({ ...form, assignments: e.target.value })}
        />
      </div>
      <SelectField
        label="Status"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value as ProgramStatus })}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </SelectField>

      <div className="mt-6 flex justify-end gap-2.5">
        <button
          onClick={onClose}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-1.5 rounded-full bg-indigoink px-4 py-2 text-sm font-medium text-white shadow-soft transition-transform hover:scale-[1.02]"
        >
          {!initial && <Plus className="h-4 w-4" />}
          {initial ? "Save Changes" : "Save"}
        </button>
      </div>
    </Drawer>
  );
}
