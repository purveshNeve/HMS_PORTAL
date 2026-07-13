"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { type StatCardData } from "@/lib/mock/dashboard";
import { statIconMap, statColorClasses } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/managerDashboardStats";

function TrendBadge({ trend }: { trend: StatCardData["trend"] }) {
  const isUp = trend.direction === "up";
  const isDown = trend.direction === "down";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        isUp && "bg-emerald-50 text-emerald-600",
        isDown && "bg-rose-50 text-rose-600",
        !isUp && !isDown && "bg-slate-100 text-slate-500"
      )}
    >
      {isUp && <ArrowUpRight className="h-3 w-3" />}
      {isDown && <ArrowDownRight className="h-3 w-3" />}
      {!isUp && !isDown && <Minus className="h-3 w-3" />}
      {trend.value}
    </span>
  );
}

function StatCard({
  stat,
  index,
}: {
  stat: StatCardData;
  index: number;
}) {
  const Icon = statIconMap[stat.icon];
  const colors = statColorClasses[stat.color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      whileHover={{ scale: 1.02 }}
      className="transition-all duration-300"
    >
      <Card className="rounded-xl border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                colors.bg
              )}
            >
              <Icon className={cn("h-5 w-5", colors.text)} />
            </div>

            <TrendBadge trend={stat.trend} />
          </div>

          <p className="mt-4 text-sm font-medium text-slate-500">
            {stat.title}
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {stat.value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {stat.description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatsGrid() {
  const [stats, setStats] = useState<StatCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats();

        const dashboardCards: StatCardData[] = [
          {
            id: "employees",
            title: "Employees",
            value: data.employeeCount,
            description: "Employees under you",
            icon: "users",
            color: "blue",
            trend: {
              direction: "up",
              value: "",
              label: "Employees",
            },
          },
          {
            id: "active",
            title: "Active Employees",
            value: data.activeEmployee,
            description: "Currently Working",
            icon: "activity",
            color: "green",
            trend: {
              direction: "up",
              value: "",
              label: "Active",
            },
          },
          {
            id: "wfh",
            title: "Approved WFH",
            value: data.WfhRequests,
            description: "Approved Work From Home",
            icon: "home",
            color: "purple",
            trend: {
              direction: "up",
              value: "",
              label: "WFH",
            },
          },
          {
            id: "pending",
            title: "Pending Leaves",
            value: data.pendingLeaveRequest,
            description: "Waiting for approval",
            icon: "clock",
            color: "orange",
            trend: {
              direction: "up",
              value: "",
              label: "Pending",
            },
          },
          {
            id: "goals",
            title: "Active Goals",
            value: data.activeGoals,
            description: "Goals in progress",
            icon: "target",
            color: "indigo",
            trend: {
              direction: "up",
              value: "",
              label: "Goals",
            },
          },
        ];

        setStats(dashboardCards);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="h-36 animate-pulse bg-slate-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.id}
          stat={stat}
          index={index}
        />
      ))}
    </div>
  );
}