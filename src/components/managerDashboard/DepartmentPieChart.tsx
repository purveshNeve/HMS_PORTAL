"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  attendance: number;
  currentGoal: string;
  status: "Active" | "Remote" | "On Leave";
  profileImage?: string;
}

interface DepartmentSlice {
  department: string;
  count: number;
}

const chartColors = [
  "#6366F1",
  "#EC4899",
  "#22C55E",
  "#F59E0B",
  "#14B8A6",
  "#FB7185",
  "#8B5CF6",
  "#38BDF8",
];

export function DepartmentPieChart() {
  const [employees, setEmployees] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch("/api/managerDashboard/teamOverviewFetch", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load team distribution");
        }

        const data = (await response.json()) as TeamMember[];
        setEmployees(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load team distribution");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  const departmentDistribution = useMemo<DepartmentSlice[]>(() => {
    const counts = employees.reduce<Record<string, number>>((acc, employee) => {
      const key = employee.department || "Unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([department, count]) => ({ department, count }));
  }, [employees]);

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
          {loading ? (
            <div className="flex h-[260px] items-center justify-center text-sm text-slate-500">
              Loading department distribution...
            </div>
          ) : error ? (
            <div className="flex h-[260px] items-center justify-center text-sm text-rose-600">
              {error}
            </div>
          ) : departmentDistribution.length === 0 ? (
            <div className="flex h-[260px] items-center justify-center text-sm text-slate-500">
              No department data available.
            </div>
          ) : (
            <div className="h-[300px] min-h-[300px] w-full">
              <div className="flex h-full items-center justify-center">
                <PieChart width={260} height={260}>
                  <Pie
                    data={departmentDistribution}
                    dataKey="count"
                    nameKey="department"
                    cx={130}
                    cy={130}
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={4}
                    animationDuration={900}
                    label={false}
                    stroke="#fff"
                  >
                    {departmentDistribution.map((slice, index) => (
                      <Cell
                        key={slice.department}
                        fill={chartColors[index % chartColors.length]}
                        stroke="#fff"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value ?? 0}`, "Employees"]}
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
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
