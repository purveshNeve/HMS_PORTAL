export type GoalStatus = "not_started" | "in_progress" | "at_risk" | "completed";

export interface Goal {
  id: string;
  employeeId: string;
  title: string;
  description?: string;
  targetDate: string;
  progress: number;
  status: GoalStatus;
}

export interface Appraisal {
  id: string;
  employeeId: string;
  reviewerId: string;
  period: string;
  rating: number;
  status: "draft" | "submitted" | "acknowledged";
  summary?: string;
}

export interface LearningCourse {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  progress: number;
  status: "not_started" | "in_progress" | "completed";
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  targetDate: string;
}
