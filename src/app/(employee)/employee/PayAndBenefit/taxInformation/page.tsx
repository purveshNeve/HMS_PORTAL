"use client";

import TaxInformation from "@/components/pay-benefits/TaxInformation";
import BankingInformation from "@/components/pay-benefits/BankingInformation";
import BonusIncentives from "@/components/pay-benefits/BonusIncentives";

export default function PayBenefitsTaxInformationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TaxInformation />
          <BankingInformation />
        </div>
        <BonusIncentives />
      </div>
    </div>
  );
}
