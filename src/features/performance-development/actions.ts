"use server";

import { revalidatePath } from "next/cache";

import type { CreateGoalInput, Goal } from "./types";

export async function createGoal(
  employeeId: string,
  input: CreateGoalInput,
): Promise<{ success: boolean; data?: Goal; error?: string }> {
  try {
    const goal: Goal = {
      id: crypto.randomUUID(),
      employeeId,
      ...input,
      progress: 0,
      status: "not_started",
    };

    revalidatePath("/employee/dashboard");
    revalidatePath("/manager/dashboard");

    return { success: true, data: goal };
  } catch {
    return { success: false, error: "Failed to create goal." };
  }
}

export async function updateGoalProgress(
  goalId: string,
  progress: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    void goalId;
    void progress;
    revalidatePath("/employee/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update goal progress." };
  }
}

export async function submitAppraisal(
  appraisalId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    void appraisalId;
    revalidatePath("/manager/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to submit appraisal." };
  }
}
