"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import KpiCards from "./KpiCards";
import AnalyticsCharts from "./AnalyticsCharts";
import RecentActivities from "./RecentActivities";
import UpcomingTrainings from "./UpcomingTrainings";
import QuickActions from "./QuickActions";
import NotificationsPanel from "./NotificationsPanel";
import DashboardSkeleton from "./DashboardSkeleton";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Career Development Dashboard
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          A snapshot of learning activity, program health, and what needs your attention.
        </p>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="space-y-8"
        >
          <KpiCards />
          <AnalyticsCharts />

          <div>
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">Activity &amp; Planning</h2>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <RecentActivities />
              <UpcomingTrainings />
              <div className="flex flex-col gap-4">
                <QuickActions />
                <NotificationsPanel />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
