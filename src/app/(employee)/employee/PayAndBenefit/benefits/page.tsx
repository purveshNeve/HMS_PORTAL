"use client";
import Benefits from "@/components/pay-benefits/Benefits";
import Reimbursements from "@/components/pay-benefits/Reimbursements";
export default function PayBenefitsBenefitsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <Benefits />
        <Reimbursements />
      </div>
    </div>
  );
}
