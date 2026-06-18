import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

import type { JobPosting } from "../types";

export interface JobPostingCardProps {
  posting: JobPosting;
}

export function JobPostingCard({ posting }: JobPostingCardProps) {
  return (
    <Card title={posting.title} description={`${posting.department} · ${posting.location}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="capitalize text-zinc-600 dark:text-zinc-400">
          {posting.status.replace("_", " ")}
        </span>
        <span className="font-medium text-zinc-900 dark:text-zinc-50">
          {posting.applicantCount} applicants
        </span>
      </div>
      <p className="mt-2 text-xs text-zinc-500">
        Posted {formatDate(posting.createdAt)}
      </p>
    </Card>
  );
}
