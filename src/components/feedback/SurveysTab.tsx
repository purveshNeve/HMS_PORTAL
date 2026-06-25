import { ClipboardList, ChevronRight } from "lucide-react";
import { surveys } from "@/data/mockDataFeedback";
import { Card, CardHeader, CardTitle } from "@/components/ui/CardFeedback";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/ButtonFeedback";

export function SurveysTab() {
  const activeSurveys = surveys.filter((s) => s.status !== "Completed");
  const completedSurveys = surveys.filter((s) => s.status === "Completed");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Open Surveys</CardTitle>
          <span className="text-xs text-ink-faint">{activeSurveys.length} pending your response</span>
        </CardHeader>

        <div>
          {activeSurveys.map((survey, idx) => (
            <div
              key={survey.id}
              className={`flex items-center gap-3 px-3 py-3 ${
                idx !== activeSurveys.length - 1 ? "border-b border-border" : ""
              } hover:bg-surface-subtle/50 transition-colors`}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-surface-subtle text-ink-muted shrink-0">
                <ClipboardList size={15} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-ink">{survey.title}</p>
                  <StatusPill status={survey.status} />
                </div>
                <p className="text-xs text-ink-muted leading-snug mt-0.5">{survey.description}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-ink-faint">Due {survey.dueDate}</span>
                  <span className="text-xs text-ink-faint">{survey.questionCount} questions</span>
                </div>
                {survey.completion > 0 && (
                  <div className="mt-2 max-w-xs">
                    <div className="h-1.5 rounded-full bg-surface-subtle overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full"
                        style={{ width: `${survey.completion}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <Button variant="secondary" size="sm" className="shrink-0">
                {survey.status === "Not Started" ? "Start Survey" : "Continue"}
                <ChevronRight size={12} />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completed Surveys</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-subtle/60 text-left">
                <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Survey</th>
                <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Completed</th>
                <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Questions</th>
                <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {completedSurveys.map((survey) => (
                <tr key={survey.id} className="border-b border-border last:border-b-0 hover:bg-surface-subtle/50 transition-colors">
                  <td className="px-3 py-2.5 text-ink font-medium">{survey.title}</td>
                  <td className="px-3 py-2.5 text-ink-muted whitespace-nowrap">{survey.dueDate}</td>
                  <td className="px-3 py-2.5 text-ink-muted">{survey.questionCount}</td>
                  <td className="px-3 py-2.5">
                    <StatusPill status={survey.status} />
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
