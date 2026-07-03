"use client";

import { offerStats, offerAcceptance } from "@/lib/mock-data";
import { OfferAcceptanceChart } from "@/components/recruitments/dashboard/OfferAcceptanceChart";
import { TrendingUp, Clock3, HandCoins, CheckCircle } from "lucide-react";

const metrics = [
  { label: "Acceptance Rate", value: `${offerStats.acceptanceRate}%`, icon: CheckCircle },
  { label: "Avg. Negotiation", value: `${offerStats.avgNegotiationDays}d`, icon: HandCoins },
  { label: "Avg. Time to Sign", value: `${offerStats.avgTimeToSign}d`, icon: Clock3 },
  { label: "Pending Offers", value: String(offerStats.pendingOffers), icon: TrendingUp },
];

export function OfferAnalytics() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="card-surface p-5">
        <h3 className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">Offer Acceptance Rate</h3>
        <p className="mb-2 text-xs text-ink-400">Outcome distribution across all offers</p>
        <OfferAcceptanceChart />
      </div>

      <div className="card-surface p-5 lg:col-span-2">
        <h3 className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">Offer Performance Metrics</h3>
        <p className="mb-4 text-xs text-ink-400">Key negotiation and conversion indicators</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="rounded-xl border border-ink-100 p-3.5 dark:border-ink-700">
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-evergreen-50 text-evergreen-700 dark:bg-evergreen-900/40 dark:text-evergreen-300">
                  <Icon size={15} />
                </div>
                <p className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">{m.value}</p>
                <p className="text-[11px] text-ink-400">{m.label}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 rounded-xl bg-ink-50/70 p-3.5 text-xs text-ink-500 dark:bg-ink-800/40 dark:text-ink-300">
          <span className="font-semibold text-ink-700 dark:text-ink-100">Compensation benchmarking:</span> offers made this
          quarter tracked within 4% of internal market bands, with{" "}
          {offerAcceptance[2].value} candidates entering negotiation over base salary.
        </div>
      </div>
    </div>
  );
}
