"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { offerAcceptance } from "@/lib/mock-data";
import { ChartTooltip } from "./ChartTooltip";

export function OfferAcceptanceChart() {
  const total = offerAcceptance.reduce((s, d) => s + d.value, 0);
  const acceptedPct = Math.round((offerAcceptance[0].value / total) * 100);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={offerAcceptance}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={90}
            paddingAngle={3}
            startAngle={90}
            endAngle={-270}
          >
            {offerAcceptance.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-semibold text-ink-900 dark:text-ink-50">{acceptedPct}%</span>
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink-400">Accepted</span>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {offerAcceptance.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-ink-500 dark:text-ink-300">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}
