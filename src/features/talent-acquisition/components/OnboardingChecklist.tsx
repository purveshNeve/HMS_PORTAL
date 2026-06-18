"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { completeOnboardingTaskAction } from "@/features/talent-acquisition/actions";
import type { OnboardingTask } from "@/features/talent-acquisition/types";

export interface OnboardingChecklistProps {
  tasks: OnboardingTask[];
}

export function OnboardingChecklist({ tasks }: OnboardingChecklistProps) {
  const handleToggle = async (taskId: string) => {
    await completeOnboardingTaskAction(taskId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Onboarding Checklist</CardTitle>
        <CardDescription>Track new hire setup tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => void handleToggle(task.id)}
                className="h-4 w-4 rounded border-foreground/20"
              />
              <div className="flex-1">
                <p className={task.completed ? "text-foreground/50 line-through" : ""}>
                  {task.title}
                </p>
                <p className="text-xs text-foreground/50">
                  {task.dueDate
                    ? `Due ${new Date(task.dueDate).toLocaleDateString()}`
                    : "No due date"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
