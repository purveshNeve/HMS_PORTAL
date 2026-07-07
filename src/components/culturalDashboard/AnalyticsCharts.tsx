"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  completionTrend,
  skillsDistribution,
  departmentProgress,
  learningHours,
  monthlyParticipation,
} from "@/data/dashboardData";

const donutColors = ["#3730E0", "#E8A33D", "#F0665A", "#4C8B62", "#5B7FDB"];

function ChartCard({
  title,
  subtitle,
  delay = 0,
  children,
}: {
  title: string;
  subtitle: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay }}
      className="rounded-xl2 border border-line bg-card p-5 shadow-soft"
    >
      <h3 className="font-display text-sm font-semibold text-ink">{title}</h3>
      <p className="mb-4 text-xs text-muted">{subtitle}</p>
      <div className="h-56 w-full">{children}</div>
    </motion.div>
  );
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #E7E4DC",
  fontSize: 12,
  boxShadow: "0 8px 24px -8px rgba(28,29,33,0.15)",
};

export default function AnalyticsCharts() {
  return (
    <div>
      <h2 className="mb-4 font-display text-lg font-semibold text-ink">
        Learning Progress Analytics
      </h2>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard
          title="Completion Trend"
          subtitle="Average program completion rate, last 6 months"
        >
          <ResponsiveContainer>
            <LineChart data={completionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E4DC" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6B6E76" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B6E76" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3730E0"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#3730E0" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Skills Distribution" subtitle="Share of learning hours by skill category" delay={0.05}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={skillsDistribution}
                dataKey="value"
                nameKey="label"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
              >
                {skillsDistribution.map((_, i) => (
                  <Cell key={i} fill={donutColors[i % donutColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                verticalAlign="bottom"
                height={24}
                wrapperStyle={{ fontSize: 11, color: "#6B6E76" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Wise Progress" subtitle="Average completion by department" delay={0.1}>
          <ResponsiveContainer>
            <BarChart data={departmentProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E4DC" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10.5, fill: "#6B6E76" }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={45}
              />
              <YAxis tick={{ fontSize: 11, fill: "#6B6E76" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#5B7FDB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Learning Hours" subtitle="Total hours logged company-wide, last 6 months" delay={0.15}>
          <ResponsiveContainer>
            <AreaChart data={learningHours}>
              <defs>
                <linearGradient id="learningHoursFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4C8B62" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#4C8B62" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E4DC" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6B6E76" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B6E76" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4C8B62"
                strokeWidth={2.5}
                fill="url(#learningHoursFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Participation" subtitle="Employees actively participating per month" delay={0.2}>
          <ResponsiveContainer>
            <BarChart data={monthlyParticipation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7E4DC" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6B6E76" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B6E76" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill="#E8A33D" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
