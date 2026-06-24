"use client";
import { payrollTimeline } from "@/data/payBenefitsData";
import { CheckCircle2, Clock } from "lucide-react";

export default function PayrollTimeline() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-600 to-teal-600" />
        <h2 className="text-lg font-semibold text-slate-800">Payroll Timeline</h2>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <p className="text-xs text-slate-500 font-medium mb-6">May 2026 Payroll Cycle</p>
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-gradient-to-b from-emerald-400 to-emerald-200" />
          <div className="space-y-6">
            {payrollTimeline.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    step.status === "completed"
                      ? "bg-emerald-500 shadow-lg shadow-emerald-200"
                      : "bg-slate-200"
                  }`}
                >
                  {step.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Clock className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold ${step.status === "completed" ? "text-slate-800" : "text-slate-400"}`}>
                      {step.step}
                    </p>
                    <p className={`text-xs ${step.status === "completed" ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                      {step.date}
                    </p>
                  </div>
                  {step.status === "completed" && (
                    <p className="text-xs text-emerald-600 mt-0.5 font-medium">✓ Completed</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
