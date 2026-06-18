"use server";

import { revalidatePath } from "next/cache";

import type { CreateJobPostingInput, JobPosting } from "./types";

export async function createJobPosting(
  input: CreateJobPostingInput,
): Promise<{ success: boolean; data?: JobPosting; error?: string }> {
  try {
    const posting: JobPosting = {
      id: crypto.randomUUID(),
      ...input,
      status: "draft",
      applicantCount: 0,
      createdAt: new Date().toISOString(),
    };

    revalidatePath("/admin/dashboard");

    return { success: true, data: posting };
  } catch {
    return { success: false, error: "Failed to create job posting." };
  }
}

export async function updateCandidateStage(
  candidateId: string,
  stage: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    void candidateId;
    void stage;
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update candidate stage." };
  }
}

export async function completeOnboardingItem(
  itemId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    void itemId;
    revalidatePath("/employee/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to complete onboarding item." };
  }
}

export const completeOnboardingTaskAction = completeOnboardingItem;
