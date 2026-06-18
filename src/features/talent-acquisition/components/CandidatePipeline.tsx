import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import type { Candidate } from "@/features/talent-acquisition/types";

const statusColors: Record<Candidate["status"], string> = {
  applied: "bg-blue-100 text-blue-800",
  screening: "bg-yellow-100 text-yellow-800",
  interview: "bg-purple-100 text-purple-800",
  offer: "bg-green-100 text-green-800",
  hired: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
};

export interface CandidatePipelineProps {
  candidates: Candidate[];
}

export function CandidatePipeline({ candidates }: CandidatePipelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Pipeline</CardTitle>
        <CardDescription>Active applicants across all open roles</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-foreground/10">
          {candidates.map((candidate) => (
            <li key={candidate.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">{candidate.fullName}</p>
                <p className="text-sm text-foreground/60">{candidate.email}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColors[candidate.status]}`}
              >
                {candidate.status}
              </span>
            </li>
          ))}
          {candidates.length === 0 && (
            <li className="py-6 text-center text-sm text-foreground/50">
              No candidates in pipeline
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
