import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

import type { Goal } from "../types";

export interface GoalTrackerProps {
  goal?: Goal;
  goals?: Goal[];
}

function GoalItem({ goal }: { goal: Goal }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-900 dark:text-zinc-50">{goal.title}</span>
        <span className="font-medium">{goal.progress}%</span>
      </div>
      <p className="text-xs text-zinc-500">Due {formatDate(goal.targetDate)}</p>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100"
          style={{ width: `${goal.progress}%` }}
        />
      </div>
    </div>
  );
}

export function GoalTracker({ goal, goals }: GoalTrackerProps) {
  const items = goals ?? (goal ? [goal] : []);

  if (items.length === 1) {
    const single = items[0];
    return (
      <Card title={single.title} description={`Due ${formatDate(single.targetDate)}`}>
        <GoalItem goal={single} />
      </Card>
    );
  }

  return (
    <Card title="Goals" description="Track progress on assigned objectives">
      <div className="space-y-6">
        {items.map((item) => (
          <GoalItem key={item.id} goal={item} />
        ))}
        {items.length === 0 ? (
          <p className="text-sm text-zinc-500">No goals assigned yet.</p>
        ) : null}
      </div>
    </Card>
  );
}
