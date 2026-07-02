"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { departmentHiring } from "@/lib/mock-data";
import { ChartTooltip } from "./ChartTooltip";

const colors = ["#0B2B26", "#1B6350", "#227A5F", "#3F9078", "#71B19C", "#A3CDBE", "#C9A24B", "#DDB966"];

export function DepartmentChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={departmentHiring} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-ink-100 dark:text-ink-700" />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7C72" }} axisLine={false} tickLine={false} />
        <YAxis
          dataKey="department"
          type="category"
          width={112}
          tick={{ fontSize: 12, fill: "#495B51" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(11,43,38,0.04)" }} />
        <Bar dataKey="hires" name="Hires" radius={[0, 6, 6, 0]} barSize={16}>
          {departmentHiring.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
