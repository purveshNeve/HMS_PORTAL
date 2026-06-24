"use client";
import { useState } from "react";
import { reimbursements } from "@/data/payBenefitsData";
import { Plus, Upload, X, CheckCircle2, Clock, XCircle } from "lucide-react";

const statusConfig = {
  Approved: {
    label: "Approved",
    icon: CheckCircle2,
    cls: "bg-green-100 text-green-700",
  },
  Pending: {
    label: "Pending",
    icon: Clock,
    cls: "bg-amber-100 text-amber-700",
  },
  Rejected: {
    label: "Rejected",
    icon: XCircle,
    cls: "bg-red-100 text-red-700",
  },
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

const claimTypes = ["Travel", "Food", "Internet", "Training", "Medical", "Office Supplies"];

export default function Reimbursements() {
  const [showModal, setShowModal] = useState(false);
  const [claimType, setClaimType] = useState("Travel");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amber-500 to-orange-500" />
          <h2 className="text-lg font-semibold text-slate-800">Reimbursements</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Submit Claim
          </button>
          <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
            <Upload className="w-4 h-4" /> Upload Receipt
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Claim Type", "Amount", "Submitted", "Status", "Approved", "Payment Date", "Remarks"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reimbursements.map((r, i) => {
                const cfg = statusConfig[r.status as keyof typeof statusConfig];
                const Icon = cfg.icon;
                return (
                  <tr key={r.id} className={`border-b border-slate-50 hover:bg-amber-50/30 transition-colors ${i % 2 === 0 ? "" : "bg-slate-50/20"}`}>
                    <td className="px-5 py-3 text-sm font-medium text-slate-700">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs">
                        {r.claimType}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-800 font-medium">₹{fmt(r.amount)}</td>
                    <td className="px-5 py-3 text-sm text-slate-600 whitespace-nowrap">
                      {new Date(r.submissionDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.cls}`}>
                        <Icon className="w-3 h-3" /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-700">
                      {r.approvedAmount > 0 ? `₹${fmt(r.approvedAmount)}` : <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600 whitespace-nowrap">
                      {r.paymentDate === "-" ? <span className="text-slate-400">—</span> : new Date(r.paymentDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500 max-w-[180px]">{r.remarks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-800">Submit Reimbursement Claim</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Claim Type</label>
                <select
                  value={claimType}
                  onChange={(e) => setClaimType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                >
                  {claimTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Remarks</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the expense…"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
                />
              </div>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-violet-300 transition-colors">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Click to upload receipt</p>
                <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 5MB</p>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
                Cancel
              </button>
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 transition-colors">
                Submit Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
