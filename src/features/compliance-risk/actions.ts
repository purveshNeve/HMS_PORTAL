"use server";

import { revalidatePath } from "next/cache";

import type { PolicyAcknowledgement, SignPolicyInput } from "./types";

export async function signPolicy(
  input: SignPolicyInput,
): Promise<{ success: boolean; data?: PolicyAcknowledgement; error?: string }> {
  try {
    const acknowledgement: PolicyAcknowledgement = {
      id: crypto.randomUUID(),
      policyId: input.policyId,
      employeeId: input.employeeId,
      signedAt: new Date().toISOString(),
      status: "signed",
    };

    revalidatePath("/employee/dashboard");
    revalidatePath("/admin/dashboard");

    return { success: true, data: acknowledgement };
  } catch {
    return { success: false, error: "Failed to sign policy." };
  }
}

export async function scheduleAudit(
  title: string,
  scheduledDate: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    void title;
    void scheduledDate;
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to schedule audit." };
  }
}

export async function publishPolicy(
  policyId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    void policyId;
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to publish policy." };
  }
}

export async function signPolicyAction(
  policyId: string,
  employeeId: string,
): Promise<{ success: boolean; data?: PolicyAcknowledgement; error?: string }> {
  return signPolicy({ policyId, employeeId });
}
