"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { monthlyHiringTrend } from "@/lib/mock-data";
import { ChartTooltip } from "./ChartTooltip";

export function HiringTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={monthlyHiringTrend} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0B2B26" stopOpacity={0.28} />
            <stop offset="95%" stopColor="#0B2B26" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C9A24B" stopOpacity={0.45} />
            <stop offset="95%" stopColor="#C9A24B" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-ink-100 dark:text-ink-700" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7C72" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "#6B7C72" }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12 }} iconType="circle" />
        <Area
          type="monotone"
          dataKey="applications"
          name="Applications"
          stroke="#0B2B26"
          strokeWidth={2}
          fill="url(#colorApplications)"
        />
        <Area
          type="monotone"
          dataKey="hires"
          name="Hires"
          stroke="#C9A24B"
          strokeWidth={2}
          fill="url(#colorHires)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
