"use client";
import { bankingInfo } from "@/data/payBenefitsData";
import { Building2, Pencil, ShieldCheck } from "lucide-react";

export default function BankingInformation() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-teal-600 to-cyan-600" />
        <h2 className="text-lg font-semibold text-slate-800">Banking Information</h2>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-teal-50">
          <Building2 className="w-4 h-4 text-teal-600" />
          <span className="text-sm font-semibold text-teal-700">Salary Account Details</span>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-5">
          {[
            { label: "Bank Name", value: bankingInfo.bankName },
            { label: "Account Number", value: bankingInfo.accountNumber, mono: true },
            { label: "IFSC Code", value: bankingInfo.ifscCode, mono: true },
            { label: "Account Type", value: bankingInfo.accountType },
            {
              label: "Account Status",
              value: bankingInfo.status,
              isStatus: true,
            },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs text-slate-500 font-medium mb-1">{item.label}</p>
              {item.isStatus ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-700">
                  <ShieldCheck className="w-4 h-4" /> {item.value}
                </span>
              ) : (
                <p className={`text-sm font-bold text-slate-800 ${item.mono ? "font-mono" : ""}`}>
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="px-5 pb-5">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
            <Pencil className="w-4 h-4" /> Update Bank Details
          </button>
        </div>
      </div>
    </section>
  );
}
