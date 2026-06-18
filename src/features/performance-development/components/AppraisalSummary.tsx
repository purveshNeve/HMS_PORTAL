import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Appraisal } from "@/features/performance-development/types";

export interface AppraisalSummaryProps {
  appraisals: Appraisal[];
}

export function AppraisalSummary({ appraisals }: AppraisalSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appraisal Summary</CardTitle>
        <CardDescription>Performance review history</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-foreground/10">
          {appraisals.map((appraisal) => (
            <li key={appraisal.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{appraisal.period}</p>
                <p className="text-xs capitalize text-foreground/50">
                  {appraisal.status.replace("_", " ")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{appraisal.rating}/5</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
