"use server";

import { revalidatePath } from "next/cache";

import type { FeedbackSubmission, Shoutout, SubmitFeedbackInput } from "./types";

export async function submitFeedback(
  employeeId: string,
  input: SubmitFeedbackInput,
): Promise<{ success: boolean; data?: FeedbackSubmission; error?: string }> {
  try {
    const feedback: FeedbackSubmission = {
      id: crypto.randomUUID(),
      employeeId,
      ...input,
      createdAt: new Date().toISOString(),
      status: "open",
    };

    revalidatePath("/employee/dashboard");

    return { success: true, data: feedback };
  } catch {
    return { success: false, error: "Failed to submit feedback." };
  }
}

export async function sendShoutout(
  fromEmployeeId: string,
  toEmployeeId: string,
  message: string,
): Promise<{ success: boolean; data?: Shoutout; error?: string }> {
  try {
    const shoutout: Shoutout = {
      id: crypto.randomUUID(),
      fromEmployeeId,
      toEmployeeId,
      message,
      createdAt: new Date().toISOString(),
    };

    revalidatePath("/employee/dashboard");

    return { success: true, data: shoutout };
  } catch {
    return { success: false, error: "Failed to send shoutout." };
  }
}

export async function launchSurvey(
  surveyId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    void surveyId;
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to launch survey." };
  }
}
