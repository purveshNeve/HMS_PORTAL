// components/dashboard/AdminDashboard.tsx
//
// Drop this component where "Admin Dashboard" currently renders in your content area.
// It does not touch the sidebar, navbar, routing, or auth — it only renders inside
// the existing main content region.
//
// Usage:
//   import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
//   ...
//   <AdminDashboard />
"use client";

import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import { DashboardHeader } from "./adminDashboard/DashboardHeader";
import { StatsGrid } from "./adminDashboard/StatsGrid";
import { WorkforceOverview } from "./adminDashboard/WorkforceOverview";
import { RecruitmentAnalytics } from "./adminDashboard/RecruitmentAnalytics";
import { AttendanceOverview } from "./adminDashboard/AttendanceOverview";
import { PayrollOverview } from "./adminDashboard/PayrollOverview";
import { EmployeeInsights } from "./adminDashboard/EmployeeInsights";
import { ActivityTimeline } from "./adminDashboard/ActivityTimeline";
import { RecentEmployeesTable } from "./adminDashboard/RecentEmployeesTable";
import { UpcomingEvents } from "./adminDashboard/UpcomingEvents";
import { QuickActions } from "./adminDashboard/QuickActions";
import { PerformanceSnapshot } from "./adminDashboard/PerformanceSnapshot";
import { OrganizationHealth } from "./adminDashboard/OrganizationHealth";
import { NotificationsPanel } from "./adminDashboard/NotificationsPanel";
import { DashboardFooter } from "./adminDashboard/DashboardFooter";

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay }}
    >
      {children}
    </motion.div>
  );
}

export function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshKey((k) => k + 1);
    // Sections manage their own loading state; this just gives the button a brief spin.
    setTimeout(() => setIsRefreshing(false), 600);
  }, []);

  return (
    <div className="min-h-full space-y-6 bg-gray-50 p-1">
      <DashboardHeader lastUpdated={lastUpdated} onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      <Section>
        <StatsGrid refreshKey={refreshKey} onLoaded={setLastUpdated} />
      </Section>

      <Section delay={0.05}>
        <WorkforceOverview refreshKey={refreshKey} />
      </Section>

      <Section delay={0.05}>
        <RecruitmentAnalytics refreshKey={refreshKey} />
      </Section>

      <Section delay={0.05}>
        <AttendanceOverview refreshKey={refreshKey} />
      </Section>

      <Section delay={0.05}>
        <PayrollOverview refreshKey={refreshKey} />
      </Section>

      <Section delay={0.05}>
        <EmployeeInsights refreshKey={refreshKey} />
      </Section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Section delay={0.05}>
            <ActivityTimeline refreshKey={refreshKey} />
          </Section>
        </div>
        <Section delay={0.08}>
          <UpcomingEvents refreshKey={refreshKey} />
        </Section>
      </div>

      <Section delay={0.05}>
        <RecentEmployeesTable refreshKey={refreshKey} />
      </Section>

      <Section delay={0.05}>
        <QuickActions />
      </Section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Section delay={0.05}>
          <PerformanceSnapshot refreshKey={refreshKey} />
        </Section>
        <Section delay={0.08}>
          <OrganizationHealth refreshKey={refreshKey} />
        </Section>
      </div>

      <Section delay={0.05}>
        <NotificationsPanel refreshKey={refreshKey} />
      </Section>

      <Section delay={0.05}>
        <DashboardFooter refreshKey={refreshKey} />
      </Section>
    </div>
  );
}
