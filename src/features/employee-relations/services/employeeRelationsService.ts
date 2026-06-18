import type { FeedbackSubmission, Shoutout, Survey } from "../types";

export async function getRecentShoutouts(): Promise<Shoutout[]> {
  return [];
}

export async function getActiveSurveys(): Promise<Survey[]> {
  return [
    {
      id: "sur_001",
      title: "Q2 Employee Engagement",
      description: "Share your experience and help us improve.",
      dueDate: "2026-06-30",
      completionRate: 68,
      status: "active",
    },
  ];
}

export async function getFeedbackByEmployee(
  employeeId: string,
): Promise<FeedbackSubmission[]> {
  void employeeId;
  return [];
}
