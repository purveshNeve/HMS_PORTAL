"use client";

import { motion } from "framer-motion";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { departmentDistribution, type DepartmentSlice } from "@/lib/mock/dashboard";

export function DepartmentPieChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm h-full">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold text-slate-800">
            Team Distribution
          </CardTitle>
          <p className="text-xs text-slate-400">Employees by department</p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentDistribution}
                  dataKey="count"
                  nameKey="department"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  animationDuration={900}
                >
                  {departmentDistribution.map((slice: DepartmentSlice) => (
                    <Cell key={slice.department} fill={slice.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    fontSize: 12,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, color: "#64748b" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
