"use client";

import { DashboardHeader } from "./DashboardHeader";
import { StatsGrid } from "./StatsCard";
import { AttendanceChart } from "./AttendanceChart";
import { ProductivityChart } from "./ProductivityChart";
import { DepartmentPieChart } from "./DepartmentPieChart";
import { TeamOverviewTable } from "./TeamOverviewTable";
import { PendingApprovals } from "./PendingApprovals";
import { GoalProgress } from "./GoalProgress";
import { AvailabilityCard } from "./AvailabilityCard";
import { RecentActivity } from "./RecentActivity";
import { UpcomingMeetings } from "./UpcomingMeetings";
import { BirthdaysCard } from "./BirthdaysCard";
import { AnniversaryCard } from "./AnniversaryCard";
import { QuickAccess } from "./QuickAccess";
import { AIInsights } from "./AIInsights";
import { ManagerSnapshot } from "./ManagerSnapshot";
import { Announcements } from "./Announcements";
import { MiniCalendar } from "./MiniCalendar";

/**
 * ManagerDashboard
 * ----------------
 * Drop this component inside the existing page's main content area,
 * below the page title. It renders only dashboard content — no sidebar,
 * navbar, layout, or routing changes are made here.
 *
 * All data is sourced from lib/mock/dashboard.ts. Replace the mock
 * exports there (or swap components to fetch via React Query) to
 * connect real APIs — the component tree does not need to change.
 */
export function ManagerDashboard() {
  return (
    <div className="space-y-6 pb-10">
      <DashboardHeader />

      <StatsGrid />

      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Team Analytics</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AttendanceChart />
          <ProductivityChart />
        </div>
      </div>

      <TeamOverviewTable />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PendingApprovals />
        </div>
        <GoalProgress />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AvailabilityCard />
        <RecentActivity />
        <UpcomingMeetings />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BirthdaysCard />
        <AnniversaryCard />
        <DepartmentPieChart />
      </div>

      <AIInsights />

      <ManagerSnapshot />

      <QuickAccess />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Announcements />
        <MiniCalendar />
      </div>
    </div>
  );
}

export default ManagerDashboard;
