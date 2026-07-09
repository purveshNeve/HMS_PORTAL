export type ProgramLevel = "Beginner" | "Intermediate" | "Advanced";
export type ProgramStatus = "Draft" | "Active" | "Completed" | "Archived";

export interface LearningProgram {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  level: ProgramLevel;
  department: string;
  instructor: string;
  resources: number;
  assignments: number;
  progress: number; // 0-100
  status: ProgramStatus;
  enrolledUsers?: Array<{
    userId: string;
    name: string;
    email?: string;
    department?: string;
    enrolledAt?: string;
  }>;
}

export interface SkillMatrixRow {
  id: string;
  employee: string;
  department: string;
  role: string;
  currentSkills: string[];
  requiredSkills: string[];
  skillScore: number; // 0-100
  learningProgress: number; // 0-100
  recommendation: string;
}

export type CertificateStatus = "Valid" | "Expiring Soon" | "Expired" | "Pending Verification";

export interface Certificate {
  id: string;
  employee: string;
  department: string;
  certificateName: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: CertificateStatus;
  fileName: string;
  enrolledUsers?: Array<{
    userId: string;
    name: string;
    email?: string;
    department?: string;
    enrolledAt?: string;
  }>;
  enrolledUserIds?: string[];
}
