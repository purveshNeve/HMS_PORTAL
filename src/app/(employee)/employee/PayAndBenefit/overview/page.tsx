"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CompensationSummary from "@/components/pay-benefits/CompensationSummary";
import QuickActions from "@/components/pay-benefits/QuickActions";
import SalaryBreakdown from "@/components/pay-benefits/SalaryBreakdown";
import Payslips from "@/components/pay-benefits/Payslips";

function PayBenefitsOverviewContent() {
  const searchParams = useSearchParams();
  const openId = searchParams?.get("openId") ?? undefined;
  const action = searchParams?.get("action") ?? undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <CompensationSummary />
        <QuickActions />
        <SalaryBreakdown />
        <Payslips initialOpenId={openId} initialAction={action ?? undefined} />
      </div>
    </div>
  );
}

export default function PayBenefitsOverviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}> 
      <PayBenefitsOverviewContent />
    </Suspense>
  );
}
