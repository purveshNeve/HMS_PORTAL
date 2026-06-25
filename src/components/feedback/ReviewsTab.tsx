import { User, Users, UserCheck, Network, ChevronRight } from "lucide-react";
import { reviewCycles, reviewHistory } from "@/data/mockDataFeedback";
import { Card, CardHeader, CardTitle } from "@/components/ui/CardFeedback";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";

const reviewIcon: Record<string, React.ElementType> = {
  "Self Review": User,
  "Peer Review": Users,
  "Manager Review": UserCheck,
  "Direct Report Review": Network,
};

export function ReviewsTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Review Cycles</CardTitle>
          <span className="text-xs text-ink-faint">H1 2026 Performance Cycle</span>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3">
          {reviewCycles.map((cycle) => {
            const Icon = reviewIcon[cycle.reviewType];
            return (
              <div
                key={cycle.id}
                className="border border-border rounded-md p-3 hover:border-border-strong transition-colors bg-surface-raised flex flex-col"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-surface-subtle text-ink-muted">
                      <Icon size={15} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink leading-tight">{cycle.reviewType}</p>
                      <p className="text-xs text-ink-faint leading-tight">{cycle.cycleName}</p>
                    </div>
                  </div>
                  <StatusPill status={cycle.status} />
                </div>

                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-ink-faint mb-1">
                    <span>Progress</span>
                    <span>{cycle.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-surface-subtle overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${cycle.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                  <span className="text-xs text-ink-faint">
                    Due {cycle.dueDate}
                    {cycle.reviewer && cycle.reviewer !== "You" ? ` · Reviewer: ${cycle.reviewer}` : ""}
                  </span>
                  <Button variant="ghost" size="sm">
                    {cycle.status === "Not Started" ? "Start" : "Continue"}
                    <ChevronRight size={12} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review History</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/60 text-left">
                <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Cycle</th>
                <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Completed</th>
                <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Overall Rating</th>
                <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviewHistory.map((h) => (
                <tr key={h.id} className="border-b border-border last:border-b-0 hover:bg-surface-subtle/50 transition-colors">
                  <td className="px-3 py-2.5 text-ink font-medium">{h.cycleName}</td>
                  <td className="px-3 py-2.5 text-ink-muted whitespace-nowrap">{h.completedDate}</td>
                  <td className="px-3 py-2.5">
                    <span className="text-success-600 font-medium">{h.overallRating}</span>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <Button variant="ghost" size="sm">
                      View Summary
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
