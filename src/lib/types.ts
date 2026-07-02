export type Priority = "Critical" | "High" | "Medium" | "Low";

export type EmploymentType = "Full-Time" | "Part-Time" | "Contract" | "Internship";

export type RoleStatus = "Open" | "On Hold" | "Closed" | "Draft" | "Pending Approval";

export interface JobRole {
  id: string;
  title: string;
  department: string;
  hiringManager: string;
  managerAvatar: string;
  openings: number;
  filled: number;
  applications: number;
  priority: Priority;
  experience: string;
  employmentType: EmploymentType;
  salaryMin: number;
  salaryMax: number;
  location: string;
  remote: boolean;
  status: RoleStatus;
  postedOn: string;
  deadline: string;
  skills: string[];
  version: number;
}

export type PipelineStage =
  | "Applied"
  | "Screening"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Technical Round"
  | "HR Round"
  | "Selected"
  | "Rejected"
  | "Offer Released"
  | "Joined";

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  positionApplied: string;
  department: string;
  experience: string;
  skills: string[];
  education: string;
  applicationDate: string;
  matchScore: number;
  stage: PipelineStage;
  source: string;
  location: string;
  email: string;
  phone: string;
  rating: number;
  tags: string[];
  resumeSummary: string;
}

export type OfferStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Sent"
  | "Viewed"
  | "Accepted"
  | "Rejected"
  | "Negotiating"
  | "Expired";

export interface Offer {
  id: string;
  candidateName: string;
  avatar: string;
  position: string;
  department: string;
  salaryOffered: number;
  joiningDate: string;
  status: OfferStatus;
  negotiationStatus: "None" | "In Progress" | "Resolved";
  sentOn: string;
  expiresOn: string;
  approvalStage: string;
  recruiter: string;
}

export interface ActivityItem {
  id: string;
  type: "application" | "interview" | "offer" | "closed";
  title: string;
  subtitle: string;
  time: string;
}
