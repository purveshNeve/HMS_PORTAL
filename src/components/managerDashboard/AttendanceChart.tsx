"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface WeeklyAttendancePoint {
  day: string;
  present: number;
  remote: number;
  absent: number;
}

const fallbackAttendance: WeeklyAttendancePoint[] = [
  { day: "Mon", present: 1, remote: 0, absent: 0 },
  { day: "Tue", present: 1, remote: 0, absent: 0 },
  { day: "Wed", present: 0, remote: 1, absent: 0 },
  { day: "Thu", present: 1, remote: 0, absent: 0 },
  { day: "Fri", present: 0, remote: 1, absent: 0 },
  { day: "Sat", present: 0, remote: 1, absent: 0 },
  { day: "Sun", present: 1, remote: 0, absent: 0 },
];

export function AttendanceChart() {
  const [attendanceData, setAttendanceData] = useState<WeeklyAttendancePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const res = await fetch("/api/employee/dashboard-stats", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to load attendance data");
        }

        const json = await res.json();
        setAttendanceData(json.weeklyAttendance ?? fallbackAttendance);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load attendance data");
        setAttendanceData(fallbackAttendance);
      } finally {
        setLoading(false);
      }
    }

    fetchAttendance();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="rounded-xl border-slate-200 shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-base font-semibold text-slate-800">
            Weekly Attendance
          </CardTitle>
          <p className="text-xs text-slate-400">Present vs. remote vs. absent, Mon–Sun</p>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[280px] w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Loading attendance...
              </div>
            ) : error ? (
              <div className="flex h-full items-center justify-center text-sm text-rose-600">
                {error}
              </div>
            ) : attendanceData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No weekly attendance data available.
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <AreaChart width={450} height={260} data={attendanceData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="presentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="remoteGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="present"
                    name="Present"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#presentGradient)"
                    animationDuration={900}
                  />
                  <Area
                    type="monotone"
                    dataKey="remote"
                    name="Remote"
                    stroke="#0ea5e9"
                    strokeWidth={3}
                    fill="url(#remoteGradient)"
                    animationDuration={900}
                  />
                  <Area
                    type="monotone"
                    dataKey="absent"
                    name="Absent"
                    stroke="#ef4444"
                    strokeWidth={3}
                    fill="rgba(239, 68, 68, 0.16)"
                    animationDuration={900}
                  />
                </AreaChart>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
