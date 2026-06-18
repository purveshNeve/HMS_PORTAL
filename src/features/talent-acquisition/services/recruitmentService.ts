import type { Candidate, JobPosting, OnboardingChecklistItem } from "../types";

export async function getJobPostings(): Promise<JobPosting[]> {
  return [
    {
      id: "job_001",
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote",
      status: "open",
      applicantCount: 24,
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function getCandidatesByJob(jobId: string): Promise<Candidate[]> {
  void jobId;
  return [];
}

export async function getOnboardingChecklist(
  employeeId: string,
): Promise<OnboardingChecklistItem[]> {
  void employeeId;
  return [
    {
      id: "onb_001",
      employeeId,
      title: "Complete I-9 verification",
      completed: false,
      dueDate: new Date().toISOString(),
    },
  ];
}
