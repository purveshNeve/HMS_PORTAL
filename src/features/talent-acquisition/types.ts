export type JobPostingStatus = "draft" | "open" | "closed" | "on_hold";

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  status: JobPostingStatus;
  applicantCount: number;
  createdAt: string;
}

export type CandidateStatus =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

export interface Candidate {
  id: string;
  jobPostingId?: string;
  positionId?: string;
  fullName: string;
  email: string;
  status: CandidateStatus;
  appliedAt: string | Date;
}

export interface OnboardingChecklistItem {
  id: string;
  employeeId: string;
  title: string;
  completed: boolean;
  dueDate?: string | Date;
}

export type OnboardingTask = OnboardingChecklistItem;

export interface CreateJobPostingInput {
  title: string;
  department: string;
  location: string;
}
