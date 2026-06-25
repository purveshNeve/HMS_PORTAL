import { analyticsTrends } from "@/data/mockDataFeedback";
import { Card, CardHeader, CardTitle } from "@/components/ui/CardFeedback";
import { TrendLineChart } from "@/components/charts/TrendLineChart";
import { HorizontalBarChart } from "@/components/charts/HorizontalBarChart";
import { SentimentBar } from "@/components/charts/SentimentBar";

const compactMetrics = [
  { label: "Average Rating", value: "4.4 / 5.0", sub: "+0.2 vs last quarter" },
  { label: "Participation Rate", value: "84%", sub: "+3pts vs last quarter" },
  { label: "Recognition Volume", value: "142", sub: "Org-wide this quarter" },
  { label: "Avg. Response Time", value: "1.8 days", sub: "-0.4 days vs last quarter" },
];

export function AnalyticsTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {compactMetrics.map((m) => (
          <div key={m.label} className="bg-surface-raised border border-border rounded-md p-3">
            <p className="text-xs font-medium text-ink-muted uppercase tracking-wide">{m.label}</p>
            <p className="text-xl font-semibold text-ink mt-1.5">{m.value}</p>
            <p className="text-xs text-ink-faint mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Average Rating Trend</CardTitle>
          </CardHeader>
          <div className="p-3">
            <TrendLineChart data={analyticsTrends.averageRatingTrend} labels={analyticsTrends.months} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participation Rate Trend</CardTitle>
          </CardHeader>
          <div className="p-3">
            <TrendLineChart data={analyticsTrends.participationTrend} labels={analyticsTrends.months} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback by Category</CardTitle>
          </CardHeader>
          <div className="p-4">
            <HorizontalBarChart data={analyticsTrends.categoryBreakdown} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
          </CardHeader>
          <div className="p-4">
            <SentimentBar
              positive={analyticsTrends.sentimentBreakdown.positive}
              neutral={analyticsTrends.sentimentBreakdown.neutral}
              negative={analyticsTrends.sentimentBreakdown.negative}
            />
            <p className="text-xs text-ink-faint mt-3 leading-snug">
              Sentiment is derived from the language used in feedback text submitted over the last 90 days.
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recognition Trends</CardTitle>
        </CardHeader>
        <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="border border-border rounded-md p-3">
            <p className="text-ink-muted text-xs">Most Awarded Badge</p>
            <p className="text-ink font-medium mt-1">Team Player</p>
          </div>
          <div className="border border-border rounded-md p-3">
            <p className="text-ink-muted text-xs">Top Recognizing Team</p>
            <p className="text-ink font-medium mt-1">Platform Engineering</p>
          </div>
          <div className="border border-border rounded-md p-3">
            <p className="text-ink-muted text-xs">Engagement Trend (QoQ)</p>
            <p className="text-success-600 font-medium mt-1">+6.2%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
