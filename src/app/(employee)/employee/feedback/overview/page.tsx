"use client";

import { useRouter } from "next/navigation";
import { OverviewTab } from "@/components/feedback/OverviewTab";
import type { TabKey } from "@/types/feedback";

const tabRouteMap: { [key in TabKey]: string } = {
  overview: "/employee/feedback/overview",
  "give-feedback": "/employee/feedback/giveFeedback",
  received: "/employee/feedback/recieved",
  sent: "/employee/feedback/sent",
  recognition: "/employee/feedback/Recognisation",
  "360-reviews": "/employee/feedback/reviews",
  surveys: "/employee/feedback/surveys",
  analytics: "/employee/feedback/analytics",
  development: "/employee/feedback/developement",
};

export default function FeedbackOverviewPage() {
  const router = useRouter();

  return (
    <OverviewTab
      onNavigate={(tab) => router.push(tabRouteMap[tab as keyof typeof tabRouteMap])}
    />
  );
}
