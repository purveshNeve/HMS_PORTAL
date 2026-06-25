import { GraduationCap, BadgeCheck, Users2, Briefcase, ChevronRight } from "lucide-react";
import {
  developmentStrengths,
  developmentGaps,
  recommendations,
  certifications,
  managerComments,
} from "@/data/mockDataFeedback";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/ButtonFeedback";

const recTypeIcon: Record<string, React.ElementType> = {
  Course: GraduationCap,
  Certification: BadgeCheck,
  Mentorship: Users2,
  "Internal Mobility": Briefcase,
};

function SkillBar({ name, level, type }: { name: string; level: number; type: "strength" | "gap" }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-ink-muted">{name}</span>
        <span className="text-ink-faint text-xs">{level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-subtle overflow-hidden">
        <div
          className={`h-full rounded-full ${type === "strength" ? "bg-success-500" : "bg-warning-500"}`}
          style={{ width: `${level}%` }}
        />
      </div>
    </div>
  );
}

export function DevelopmentTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
          </CardHeader>
          <div className="p-3 space-y-3">
            {developmentStrengths.map((s) => (
              <SkillBar key={s.id} name={s.name} level={s.level} type={s.type} />
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Improvement Areas</CardTitle>
          </CardHeader>
          <div className="p-3 space-y-3">
            {developmentGaps.map((s) => (
              <SkillBar key={s.id} name={s.name} level={s.level} type={s.type} />
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended Training &amp; Growth Opportunities</CardTitle>
        </CardHeader>
        <div>
          {recommendations.map((rec, idx) => {
            const Icon = recTypeIcon[rec.type];
            return (
              <div
                key={rec.id}
                className={`flex items-center gap-3 px-3 py-2.5 ${
                  idx !== recommendations.length - 1 ? "border-b border-border" : ""
                } hover:bg-surface-subtle/50 transition-colors`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-surface-subtle text-ink-muted shrink-0">
                  <Icon size={15} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink leading-tight">{rec.title}</p>
                  <p className="text-xs text-ink-faint leading-tight mt-0.5">
                    {rec.provider} · {rec.duration}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0">
                  {rec.type === "Internal Mobility" ? "View Role" : "Enroll"}
                  <ChevronRight size={12} />
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-subtle/60 text-left">
                  <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Certification</th>
                  <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Issued</th>
                  <th className="px-3 py-2 font-medium text-ink-muted text-xs uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {certifications.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-b-0">
                    <td className="px-3 py-2.5">
                      <p className="text-ink font-medium">{c.name}</p>
                      <p className="text-xs text-ink-faint">{c.issuer}</p>
                    </td>
                    <td className="px-3 py-2.5 text-ink-muted whitespace-nowrap">{c.issuedDate}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-success-600 text-xs font-medium">{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manager Recommendations</CardTitle>
          </CardHeader>
          <div className="p-3 space-y-3">
            {managerComments.map((comment) => (
              <div key={comment.id}>
                <p className="text-sm font-medium text-ink">{comment.manager}</p>
                <p className="text-xs text-ink-faint mb-1.5">{comment.role}</p>
                <p className="text-sm text-ink-muted leading-snug">{comment.comment}</p>
              </div>
            ))}
            <div className="pt-2 border-t border-border">
              <p className="text-sm text-ink-muted leading-snug">
                Suggested focus for next cycle: take on a mentee and lead the executive readout for the platform migration retrospective.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Career Roadmap</CardTitle>
        </CardHeader>
        <div className="p-4">
          <div className="flex items-center gap-0">
            {["Software Engineer II", "Senior Software Engineer", "Staff Engineer"].map((role, idx) => (
              <div key={role} className="flex items-center flex-1">
                <div className="flex flex-col items-center text-center flex-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      idx === 0 ? "bg-brand-600" : "bg-border-strong"
                    }`}
                  />
                  <p className={`text-xs mt-2 ${idx === 0 ? "text-ink font-medium" : "text-ink-faint"}`}>
                    {role}
                  </p>
                  {idx === 0 && <span className="text-xs text-brand-600 mt-0.5">You are here</span>}
                </div>
                {idx < 2 && <div className="h-px bg-border-strong flex-1 -mt-5" />}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
