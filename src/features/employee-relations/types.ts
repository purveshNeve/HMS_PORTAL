export type FeedbackType = "general" | "concern" | "suggestion";

export interface FeedbackSubmission {
  id: string;
  employeeId: string;
  type: FeedbackType;
  message: string;
  isAnonymous: boolean;
  createdAt: string;
  status: "open" | "reviewed" | "closed";
}

export interface Shoutout {
  id: string;
  fromEmployeeId: string;
  toEmployeeId: string;
  message: string;
  createdAt: string | Date;
  reactions?: number;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completionRate: number;
  status: "draft" | "active" | "closed";
}

export interface SubmitFeedbackInput {
  type: FeedbackType;
  message: string;
  isAnonymous: boolean;
}
