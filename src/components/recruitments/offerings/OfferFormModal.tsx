"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal-copy";
import { candidates } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Calculator } from "lucide-react";

const offerSchema = z.object({
  candidateId: z.string().min(1, "Select a candidate"),
  ctc: z.coerce.number().min(1, "Enter an annual CTC"),
  joiningBonus: z.coerce.number().min(0),
  joiningDate: z.string().min(1, "Joining date is required"),
  benefitsPct: z.coerce.number().min(0).max(40),
});

export type OfferFormValues = z.infer<typeof offerSchema>;

export function OfferFormModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: OfferFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: { candidateId: "", ctc: 15, joiningBonus: 1, joiningDate: "", benefitsPct: 12 },
  });

  useEffect(() => {
    if (open) reset({ candidateId: "", ctc: 15, joiningBonus: 1, joiningDate: "", benefitsPct: 12 });
  }, [open, reset]);

  const values = watch();
  const breakdown = useMemo(() => {
    const ctcLakhs = Number(values.ctc) || 0;
    const ctc = ctcLakhs * 100000;
    const basic = ctc * 0.5;
    const hra = basic * 0.4;
    const benefits = ctc * ((Number(values.benefitsPct) || 0) / 100);
    const bonus = (Number(values.joiningBonus) || 0) * 100000;
    const special = ctc - basic - hra - benefits;
    return { ctc, basic, hra, benefits, bonus, special: Math.max(special, 0) };
  }, [values.ctc, values.benefitsPct, values.joiningBonus]);

  const submit = (data: OfferFormValues) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Offer" subtitle="Offer Creation Wizard · Step-by-step compensation builder" size="lg">
      <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500 dark:text-ink-300">Candidate</label>
            <select {...register("candidateId")} className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-100">
              <option value="">Select a candidate…</option>
              {candidates
                .filter((c) => ["Selected", "HR Round"].includes(c.stage))
                .map((c) => (
                  <option key={c.id} value={c.id}>{c.name} — {c.positionApplied}</option>
                ))}
            </select>
            {errors.candidateId && <p className="mt-1 text-xs text-coral-600">{errors.candidateId.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500 dark:text-ink-300">Annual CTC (₹ Lakhs)</label>
            <input type="number" step="0.5" {...register("ctc")} className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-100" />
            {errors.ctc && <p className="mt-1 text-xs text-coral-600">{errors.ctc.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500 dark:text-ink-300">Joining Bonus (₹ Lakhs)</label>
            <input type="number" step="0.1" {...register("joiningBonus")} className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-100" />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500 dark:text-ink-300">Benefits (% of CTC)</label>
            <input type="range" min={0} max={30} {...register("benefitsPct")} className="w-full accent-evergreen-700" />
            <p className="mt-1 text-xs text-ink-400">{values.benefitsPct}% allocated to benefits &amp; perks</p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500 dark:text-ink-300">Joining Date</label>
            <input type="date" {...register("joiningDate")} className="w-full rounded-xl border border-ink-100 bg-white px-3 py-2.5 text-sm dark:border-ink-700 dark:bg-surface-darkcard dark:text-ink-100" />
            {errors.joiningDate && <p className="mt-1 text-xs text-coral-600">{errors.joiningDate.message}</p>}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-ink-100 bg-ink-50/60 p-4 dark:border-ink-700 dark:bg-ink-800/40">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-300">
              <Calculator size={13} /> Compensation Preview
            </p>
            <div className="space-y-2 text-sm">
              <Row label="Basic (50%)" value={breakdown.basic} />
              <Row label="HRA (40% of basic)" value={breakdown.hra} />
              <Row label="Benefits & Perks" value={breakdown.benefits} />
              <Row label="Special Allowance" value={breakdown.special} />
              <Row label="Joining Bonus" value={breakdown.bonus} />
              <div className="mt-2 flex items-center justify-between border-t border-ink-200 pt-2 dark:border-ink-600">
                <span className="text-xs font-semibold text-ink-600 dark:text-ink-300">Total CTC</span>
                <span className="font-mono text-base font-bold text-evergreen-700 dark:text-evergreen-300">{formatCurrency(breakdown.ctc)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-ink-100 pt-4 dark:border-ink-700 lg:col-span-5">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary">Create Offer</button>
        </div>
      </form>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-ink-500 dark:text-ink-400">{label}</span>
      <span className="font-mono text-xs font-medium text-ink-700 dark:text-ink-200">{formatCurrency(value)}</span>
    </div>
  );
}
