// Shared domain types for the Employee Feedback module.
export type FeedbackCategory =
  | "Appreciation"
  | "Recognition"
  | "Collaboration"
  | "Leadership"
  | "Communication"
  | "Technical Skills"
  | "Improvement Suggestion"
  | "Project Feedback";

export type FeedbackVisibility = "Public" | "Manager Only" | "Private" | "Anonymous";

export type FeedbackStatus = "Read" | "Unread" | "Archived" | "Draft" | "Sent" | "Withdrawn";

export type RecipientType =
  | "Manager"
  | "Peer"
  | "Team Member"
  | "HR"
  | "Cross Functional Employee";

export interface ReceivedFeedback {
  id: string;
  sender: string;
  senderRole: string;
  senderInitials: string;
  date: string;
  category: FeedbackCategory;
  rating: number; // 0-5, 0 means not rated
  visibility: FeedbackVisibility;
  status: FeedbackStatus;
  subject: string;
  excerpt: string;
}

export interface SentFeedback {
  id: string;
  recipient: string;
  recipientRole: string;
  date: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  visibility: FeedbackVisibility;
  deliveryStatus: "Delivered" | "Pending" | "Failed";
  subject: string;
}

export interface RecognitionItem {
  id: string;
  type: "Kudos" | "Badge" | "Milestone" | "Award";
  title: string;
  description: string;
  from: string;
  date: string;
  icon: string;
}

export interface ReviewCycle {
  id: string;
  reviewType: "Self Review" | "Peer Review" | "Manager Review" | "Direct Report Review";
  cycleName: string;
  status: "Not Started" | "In Progress" | "Submitted" | "Completed";
  progress: number;
  dueDate: string;
  reviewer?: string;
}

export interface SurveyItem {
  id: string;
  title: string;
  description: string;
  status: "Not Started" | "In Progress" | "Completed";
  dueDate: string;
  completion: number;
  questionCount: number;
}

export interface DevelopmentSkill {
  id: string;
  name: string;
  level: number; // 0-100
  type: "strength" | "gap";
}

export interface Recommendation {
  id: string;
  title: string;
  provider: string;
  type: "Course" | "Certification" | "Mentorship" | "Internal Mobility";
  duration: string;
}

export interface ActivityItem {
  id: string;
  type: "feedback_received" | "recognition" | "review" | "survey" | "feedback_sent";
  actor: string;
  description: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "feedback" | "review" | "recognition" | "survey" | "system";
}

export interface SummaryMetric {
  id: string;
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: "up" | "down" | "flat";
  helpText: string;
}

export type TabKey =
  | "overview"
  | "give-feedback"
  | "received"
  | "sent"
  | "recognition"
  | "360-reviews"
  | "surveys"
  | "analytics"
  | "development";

export interface ModuleTab {
  key: TabKey;
  label: string;
  badge?: number;
}
