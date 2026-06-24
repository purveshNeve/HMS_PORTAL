"use client";
import { bonuses } from "@/data/payBenefitsData";
import { Trophy, TrendingUp } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

const totalBonuses = bonuses.reduce((a, b) => a + b.amount, 0);

export default function BonusIncentives() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amber-500 to-yellow-400" />
        <h2 className="text-lg font-semibold text-slate-800">Bonus & Incentives</h2>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Summary header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-amber-50">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">Incentive History</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span className="text-slate-500 text-xs">Total paid:</span>
            <span className="font-bold text-amber-700">₹{fmt(totalBonuses)}</span>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {bonuses.map((b, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4 hover:bg-amber-50/30 transition-colors">
              <div>
                <p className="text-sm font-semibold text-slate-800">{b.type}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-bold text-slate-800">₹{fmt(b.amount)}</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
