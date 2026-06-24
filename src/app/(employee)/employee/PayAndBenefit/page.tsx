"use client";

import CompensationSummary from "@/components/pay-benefits/CompensationSummary";
import SalaryBreakdown from "@/components/pay-benefits/SalaryBreakdown";
import Payslips from "@/components/pay-benefits/Payslips";
import Reimbursements from "@/components/pay-benefits/Reimbursements";
import Benefits from "@/components/pay-benefits/Benefits";
import TaxInformation from "@/components/pay-benefits/TaxInformation";
import BankingInformation from "@/components/pay-benefits/BankingInformation";
import BonusIncentives from "@/components/pay-benefits/BonusIncentives";
import PayrollTimeline from "@/components/pay-benefits/PayrollTimeline";
import QuickActions from "@/components/pay-benefits/QuickActions";
import Analytics from "@/components/pay-benefits/Analytics";
import Notifications from "@/components/pay-benefits/Notifications";
import { employeeData } from "@/data/payBenefitsData";
import { IndianRupee } from "lucide-react";

export default function PayBenefitsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
                  <IndianRupee className="w-3.5 h-3.5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-slate-900">My Pay & Benefits</h1>
              </div>
              <p className="text-xs text-slate-500 ml-8">
                View your salary details, compensation, reimbursements, benefits and financial information.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{employeeData.name}</p>
                <p className="text-xs text-slate-500">{employeeData.designation} · {employeeData.id}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {employeeData.name.split(" ").map((n) => n[0]).join("")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* 1. Compensation Summary */}
        <CompensationSummary />

        {/* 2. Quick Actions */}
        <QuickActions />

        {/* 3. Salary Breakdown + Payslips */}
        <SalaryBreakdown />
        <Payslips />

        {/* 4. Benefits + Reimbursements */}
        <Benefits />
        <Reimbursements />

        {/* 5. Tax + Banking side by side on wide screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TaxInformation />
          <BankingInformation />
        </div>

        {/* 6. Bonus + Timeline side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BonusIncentives />
          <PayrollTimeline />
        </div>

        {/* 7. Analytics */}
        <Analytics />

        {/* 8. Notifications */}
        <Notifications />
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">HRMS Employee Self-Service Portal</p>
          <p className="text-xs text-slate-400">Data as of June 2026 · Confidential</p>
        </div>
      </div>
    </div>
  );
}
