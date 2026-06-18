"use server";

import { revalidatePath } from "next/cache";

import type { CreatePtoRequestInput, PtoRequest } from "./types";

export async function submitPtoRequest(
  employeeId: string,
  input: CreatePtoRequestInput,
): Promise<{ success: boolean; data?: PtoRequest; error?: string }> {
  try {
    const request: PtoRequest = {
      id: crypto.randomUUID(),
      employeeId,
      ...input,
      status: "pending",
    };

    revalidatePath("/employee/dashboard");
    revalidatePath("/manager/dashboard");

    return { success: true, data: request };
  } catch {
    return { success: false, error: "Failed to submit PTO request." };
  }
}

export async function approvePtoRequest(
  requestId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    void requestId;
    revalidatePath("/manager/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to approve PTO request." };
  }
}

export async function runPayrollCycle(
  period: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    void period;
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to run payroll cycle." };
  }
}
