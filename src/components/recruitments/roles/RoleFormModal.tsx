"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal-copy";
import { JobRole } from "@/lib/types";
import { departments } from "@/lib/mock-data";
import { Wand2 } from "lucide-react";

const roleSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  department: z.string().min(1, "Select a department"),
  hiringManager: z.string().min(2, "Hiring manager is required"),
  experience: z.string().min(1, "Required experience is required"),
  skills: z.string().min(1, "List at least one skill"),
  employmentType: z.enum(["Full-Time", "Part-Time", "Contract", "Internship"]),
  openings: z.coerce.number().min(1, "At least 1 opening required").max(50),
  salaryMin: z.coerce.number().min(1, "Minimum salary required"),
  salaryMax: z.coerce.number().min(1, "Maximum salary required"),
  location: z.string().min(2, "Location is required"),
  remote: z.boolean(),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
  deadline: z.string().min(1, "Application deadline is required"),
  description: z.string().min(10, "Add a short job description (10+ characters)"),
}).refine((data) => data.salaryMax >= data.salaryMin, {
  message: "Maximum salary must be greater than minimum",
  path: ["salaryMax"],
});

export type RoleFormValues = z.infer<typeof roleSchema>;

const templates: Record<string, Partial<RoleFormValues>> = {
  "Software Engineer": {
    title: "Software Engineer",
    department: "Engineering",
    experience: "2-5 yrs",
    skills: "TypeScript, React, Node.js",
    employmentType: "Full-Time",
    salaryMin: 12,
    salaryMax: 22,
    description: "Design, build and ship reliable product features end to end alongside a cross-functional team.",
  },
  "Product Manager": {
    title: "Product Manager",
    department: "Product",
    experience: "3-6 yrs",
    skills: "Roadmapping, SQL, Stakeholder Management",
    employmentType: "Full-Time",
    salaryMin: 18,
    salaryMax: 30,
    description: "Own the product roadmap for a core surface, partnering closely with design and engineering.",
  },
  "Account Executive": {
    title: "Enterprise Account Executive",
    department: "Sales",
    experience: "4-8 yrs",
    skills: "SaaS Sales, Negotiation, Forecasting",
    employmentType: "Full-Time",
    salaryMin: 14,
    salaryMax: 24,
    description: "Own the full sales cycle for enterprise accounts, from prospecting through to close.",
  },
};

const defaultValues: RoleFormValues = {
  title: "",
  department: "Engineering",
  hiringManager: "",
  experience: "",
  skills: "",
  employmentType: "Full-Time",
  openings: 1,
  salaryMin: 10,
  salaryMax: 18,
  location: "Bengaluru, IN",
  remote: false,
  priority: "Medium",
  deadline: "",
  description: "",
};

export function RoleFormModal({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: RoleFormValues) => void;
  initial?: JobRole | null;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      if (initial) {
        reset({
          title: initial.title,
          department: initial.department,
          hiringManager: initial.hiringManager,
          experience: initial.experience,
          skills: initial.skills.join(", "),
          employmentType: initial.employmentType,
          openings: initial.openings,
          salaryMin: Math.round(initial.salaryMin / 100000),
          salaryMax: Math.round(initial.salaryMax / 100000),
          location: initial.location,
          remote: initial.remote,
          priority: initial.priority,
          deadline: initial.deadline.slice(0, 10),
          description: `${initial.title} role within ${initial.department}, reporting to ${initial.hiringManager}.`,
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [open, initial, reset]);

  const applyTemplate = (key: string) => {
    const t = templates[key];
    if (!t) return;
    Object.entries(t).forEach(([field, value]) => {
      setValue(field as keyof RoleFormValues, value as never, { shouldValidate: true });
    });
  };

  const submit = (values: RoleFormValues) => {
    onSubmit(values);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Edit Role" : "Create New Role"}
      subtitle={initial ? `Version ${initial.version} · Last published ${initial.postedOn.slice(0, 10)}` : "Fill in the details to publish a new opening"}
      size="lg"
    >
      {!initial && (
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl bg-ink-50 p-3 dark:bg-ink-800/60">
          <span className="flex items-center gap-1.5 text-xs font-medium text-ink-500 dark:text-ink-300">
            <Wand2 size={14} /> Start from a template:
          </span>
          {Object.keys(templates).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => applyTemplate(t)}
              className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-600 transition-colors hover:border-evergreen-400 hover:text-evergreen-700 dark:border-ink-600 dark:bg-surface-darkcard dark:text-ink-200"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Job Title" error={errors.title?.message}>
            <input {...register("title")} className="input" placeholder="e.g. Senior Backend Engineer" />
          </Field>
          <Field label="Department" error={errors.department?.message}>
            <select {...register("department")} className="input">
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Hiring Manager" error={errors.hiringManager?.message}>
            <input {...register("hiringManager")} className="input" placeholder="e.g. Ananya Rao" />
          </Field>
          <Field label="Required Experience" error={errors.experience?.message}>
            <input {...register("experience")} className="input" placeholder="e.g. 3-5 yrs" />
          </Field>
          <Field label="Skills Required" error={errors.skills?.message} full>
            <input {...register("skills")} className="input" placeholder="Comma separated, e.g. React, Node.js, AWS" />
          </Field>
          <Field label="Employment Type" error={errors.employmentType?.message}>
            <select {...register("employmentType")} className="input">
              {["Full-Time", "Part-Time", "Contract", "Internship"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Number of Openings" error={errors.openings?.message}>
            <input type="number" min={1} {...register("openings")} className="input" />
          </Field>
          <Field label="Minimum Salary (₹ Lakhs / yr)" error={errors.salaryMin?.message}>
            <input type="number" {...register("salaryMin")} className="input" />
          </Field>
          <Field label="Maximum Salary (₹ Lakhs / yr)" error={errors.salaryMax?.message}>
            <input type="number" {...register("salaryMax")} className="input" />
          </Field>
          <Field label="Location" error={errors.location?.message}>
            <input {...register("location")} className="input" placeholder="e.g. Mumbai, IN" />
          </Field>
          <Field label="Hiring Priority" error={errors.priority?.message}>
            <select {...register("priority")} className="input">
              {["Critical", "High", "Medium", "Low"].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Application Deadline" error={errors.deadline?.message}>
            <input type="date" {...register("deadline")} className="input" />
          </Field>
          <Field label="Job Description" error={errors.description?.message} full>
            <textarea {...register("description")} rows={3} className="input resize-none" placeholder="Summarize the role, responsibilities and impact…" />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300 sm:col-span-2">
            <input type="checkbox" {...register("remote")} className="h-4 w-4 rounded border-ink-300 text-evergreen-700 focus:ring-evergreen-500" />
            Remote availability for this role
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-ink-100 pt-4 dark:border-ink-700">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {initial ? "Save Changes" : "Publish Role"}
          </button>
        </div>
      </form>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(199 210 204 / 0.6);
          background: white;
          padding: 0.6rem 0.75rem;
          font-size: 0.875rem;
          color: #26332e;
        }
        .dark .input {
          background: #161f1b;
          border-color: #344540;
          color: #f4f6f4;
        }
        .input:focus {
          outline: none;
          border-color: #3f9078;
        }
      `}</style>
    </Modal>
  );
}

function Field({
  label,
  error,
  children,
  full,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-medium text-ink-500 dark:text-ink-300">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-coral-600">{error}</p>}
    </div>
  );
}
