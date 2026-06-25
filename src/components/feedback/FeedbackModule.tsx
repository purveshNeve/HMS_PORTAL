"use client";

import { useState } from "react";
import { TabKey } from "@/types/feedback";
import { moduleTabs } from "@/data/mockDataFeedback";
import { FeedbackPageHeader } from "./FeedbackPageHeader";
import { ModuleTabs } from "./ModuleTabs";
import { OverviewTab } from "./OverviewTab";
import { GiveFeedbackTab } from "./GiveFeedbackTab";
import { ReceivedTab } from "./ReceivedTab";
import { SentTab } from "./SentTab";
import { RecognitionTab } from "./RecognitionTab";
import { ReviewsTab } from "./ReviewsTab";
import { SurveysTab } from "./SurveysTab";
import { AnalyticsTab } from "./AnalyticsTab";
import { DevelopmentTab } from "./DevelopmentTab";

export function FeedbackModule() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <FeedbackPageHeader />
      <ModuleTabs tabs={moduleTabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="px-4 md:px-6 py-4">
        {activeTab === "overview" && <OverviewTab onNavigate={setActiveTab} />}
        {activeTab === "give-feedback" && <GiveFeedbackTab />}
        {activeTab === "received" && <ReceivedTab />}
        {activeTab === "sent" && <SentTab />}
        {activeTab === "recognition" && <RecognitionTab />}
        {activeTab === "360-reviews" && <ReviewsTab />}
        {activeTab === "surveys" && <SurveysTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "development" && <DevelopmentTab />}
      </div>
    </div>
  );
}
