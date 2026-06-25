import {
  Award,
  Users,
  Heart,
  PartyPopper,
  Crown,
  Lightbulb,
  Trophy,
} from "lucide-react";
import { recognitionAwards } from "@/data/mockDataFeedback";
import { Card, CardHeader, CardTitle } from "@/components/ui/CardFeedback";
import { Badge } from "@/components/ui/BadgeFeedback";

const iconMap: Record<string, React.ElementType> = {
  Award,
  Users,
  Heart,
  PartyPopper,
  Crown,
  Lightbulb,
  Trophy,
};

const typeColor: Record<string, string> = {
  Kudos: "bg-brand-50 text-brand-600",
  Badge: "bg-success-50 text-success-600",
  Milestone: "bg-warning-50 text-warning-600",
  Award: "bg-danger-50 text-danger-600",
};

const availableBadges = [
  { name: "Team Player", icon: "Users", description: "Awarded for cross-team collaboration." },
  { name: "Innovation Award", icon: "Lightbulb", description: "For introducing impactful new ideas." },
  { name: "Leadership Excellence", icon: "Crown", description: "Recognized leadership across teams." },
  { name: "Customer Champion", icon: "Heart", description: "Outstanding customer advocacy." },
  { name: "Outstanding Contribution", icon: "Trophy", description: "Significant individual impact." },
];

export function RecognitionTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recognition Received</CardTitle>
              <span className="text-xs text-ink-faint">{recognitionAwards.length} total</span>
            </CardHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3">
              {recognitionAwards.map((item) => {
                const Icon = iconMap[item.icon] ?? Award;
                return (
                  <div
                    key={item.id}
                    className="border border-border rounded-md p-3 hover:border-border-strong transition-colors bg-surface-raised"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-md ${typeColor[item.type]}`}>
                        <Icon size={16} strokeWidth={1.8} />
                      </div>
                      <Badge variant="neutral">{item.type}</Badge>
                    </div>
                    <p className="text-sm font-semibold text-ink leading-tight">{item.title}</p>
                    <p className="text-xs text-ink-muted leading-snug mt-1">{item.description}</p>
                    <p className="text-xs text-ink-faint mt-2">
                      From {item.from} · {item.date}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Badges</CardTitle>
            </CardHeader>
            <div>
              {availableBadges.map((badge, idx) => {
                const Icon = iconMap[badge.icon] ?? Award;
                return (
                  <div
                    key={badge.name}
                    className={`flex items-start gap-2.5 px-3 py-2.5 ${
                      idx !== availableBadges.length - 1 ? "border-b border-border" : ""
                    }`}
                  >
                    <div className="flex items-center justify-center w-7 h-7 rounded-md bg-surface-subtle text-ink-muted shrink-0">
                      <Icon size={14} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink leading-tight">{badge.name}</p>
                      <p className="text-xs text-ink-faint leading-snug mt-0.5">{badge.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Recognition</CardTitle>
            </CardHeader>
            <div className="p-3">
              <p className="text-sm text-ink-muted leading-snug">
                Your team, Platform Engineering, has received <span className="font-semibold text-ink">14 recognitions</span> this quarter — placing it in the top 10% of teams org-wide.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
