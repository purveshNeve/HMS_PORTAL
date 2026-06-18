import type { Appraisal, Goal, LearningCourse } from "../types";

export async function getGoalsByEmployee(employeeId: string): Promise<Goal[]> {
  void employeeId;
  return [
    {
      id: "goal_001",
      employeeId,
      title: "Complete leadership certification",
      targetDate: "2026-12-31",
      progress: 45,
      status: "in_progress",
    },
  ];
}

export async function getAppraisals(employeeId: string): Promise<Appraisal[]> {
  void employeeId;
  return [];
}

export async function getAssignedCourses(
  employeeId: string,
): Promise<LearningCourse[]> {
  void employeeId;
  return [];
}
