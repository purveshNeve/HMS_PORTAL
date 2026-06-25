import {
  MessageSquarePlus,
  Send,
  ClipboardCheck,
  Download,
  FileBarChart2,
  Headset,
  MessageSquare,
  Award,
  ClipboardList,
  FileQuestion,
  ArrowUpRight,
} from "lucide-react";
import {
  summaryMetrics,
  activityFeed,
  reviewDeadlines,
  managerComments,
  recentRecognitions,
} from "@/data/mockDataFeedback";
import { SummaryMetricCard } from "./SummaryMetricCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { TabKey } from "@/types/feedback";

const activityIcon: Record<string, React.ElementType> = {
  feedback_received: MessageSquare,
  recognition: Award,
  review: ClipboardList,
  survey: FileQuestion,
  feedback_sent: Send,
};

const quickActions: { label: string; icon: React.ElementType; tab?: TabKey }[] = [
  { label: "Give Feedback", icon: MessageSquarePlus, tab: "give-feedback" },
  { label: "Request Feedback", icon: Send },
  { label: "Start Self Review", icon: ClipboardCheck, tab: "360-reviews" },
  { label: "Download Feedback Report", icon: Download },
  { label: "View Performance Review", icon: FileBarChart2 },
  { label: "Contact HR", icon: Headset },
];

export function OverviewTab({ onNavigate }: { onNavigate: (tab: TabKey) => void }) {
  return (
    <div className="space-y-4">
      {/* Summary metric cards */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {summaryMetrics.map((metric) => (
            <SummaryMetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Recent activity feed */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <button className="text-xs font-medium text-brand-600 hover:underline">
                View all
              </button>
            </CardHeader>
            <div>
              {activityFeed.map((item, idx) => {
                const Icon = activityIcon[item.type] ?? MessageSquare;
                return (
                  <div
                    key={item.id}
                    className={`flex items-start gap-2.5 px-3 py-2.5 ${
                      idx !== activityFeed.length - 1 ? "border-b border-border" : ""
                    } hover:bg-surface-subtle transition-colors`}
                  >
                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-surface-subtle text-ink-muted shrink-0 mt-0.5">
                      <Icon size={14} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink leading-snug">
                        <span className="font-medium">{item.actor}</span>{" "}
                        <span className="text-ink-muted">{item.description}</span>
                      </p>
                      <p className="text-xs text-ink-faint mt-0.5">{item.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Manager comments */}
          <Card>
            <CardHeader>
              <CardTitle>Manager Comments</CardTitle>
            </CardHeader>
            <div className="p-3 space-y-3">
              {managerComments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    {comment.manager
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm font-medium text-ink">{comment.manager}</p>
                      <span className="text-xs text-ink-faint">{comment.date}</span>
                    </div>
                    <p className="text-xs text-ink-faint">{comment.role}</p>
                    <p className="text-sm text-ink-muted leading-snug mt-1.5">{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Side column */}
        <div className="space-y-4">
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <div className="p-2 grid grid-cols-1 gap-1">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => action.tab && onNavigate(action.tab)}
                    className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-ink-muted hover:bg-surface-subtle hover:text-ink transition-colors text-left"
                  >
                    <Icon size={15} strokeWidth={1.8} className="text-ink-faint shrink-0" />
                    <span className="flex-1">{action.label}</span>
                    <ArrowUpRight size={13} className="text-ink-faint shrink-0" />
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Upcoming review deadlines */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Review Deadlines</CardTitle>
            </CardHeader>
            <div>
              {reviewDeadlines.map((d, idx) => (
                <div
                  key={d.id}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 ${
                    idx !== reviewDeadlines.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm text-ink leading-snug truncate">{d.title}</p>
                    <p className="text-xs text-ink-faint mt-0.5">Due {d.dueDate}</p>
                  </div>
                  <StatusPill status={d.status} />
                </div>
              ))}
            </div>
          </Card>

          {/* Recent recognitions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Recognitions</CardTitle>
              <button
                onClick={() => onNavigate("recognition")}
                className="text-xs font-medium text-brand-600 hover:underline"
              >
                View all
              </button>
            </CardHeader>
            <div>
              {recentRecognitions.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-2.5 px-3 py-2.5 ${
                    idx !== recentRecognitions.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-success-50 text-success-600 shrink-0">
                    <Award size={14} strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink leading-snug">{item.title}</p>
                    <p className="text-xs text-ink-muted leading-snug mt-0.5">{item.description}</p>
                    <p className="text-xs text-ink-faint mt-1">
                      From {item.from} · {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
