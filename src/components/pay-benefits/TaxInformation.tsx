"use client";
import { taxInfo } from "@/data/payBenefitsData";
import { Download, Shield } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export default function TaxInformation() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-600 to-violet-600" />
        <h2 className="text-lg font-semibold text-slate-800">Tax Information</h2>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-indigo-50">
          <Shield className="w-4 h-4 text-indigo-600" />
          <span className="text-sm font-semibold text-indigo-700">FY 2025-26 Tax Summary</span>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-5">
          {[
            { label: "PAN Number", value: taxInfo.panNumber, mono: true },
            { label: "Tax Regime", value: taxInfo.taxRegime },
            { label: "Annual Tax Paid", value: `₹${fmt(taxInfo.annualTaxPaid)}` },
            { label: "TDS Deducted (Monthly)", value: `₹${fmt(taxInfo.tdsDeducted)}` },
            { label: "Tax Saving Investments", value: `₹${fmt(taxInfo.taxSavingInvestments)}` },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-slate-500 font-medium mb-1">{item.label}</p>
              <p className={`text-sm font-bold text-slate-800 ${item.mono ? "font-mono" : ""}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <div className="px-5 pb-5">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Download Form 16
          </button>
        </div>
      </div>
    </section>
  );
}
