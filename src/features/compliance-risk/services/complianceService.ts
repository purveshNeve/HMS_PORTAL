import type { AuditRecord, Policy, PolicyAcknowledgement } from "../types";

export async function getActivePolicies(): Promise<Policy[]> {
  return [
    {
      id: "pol_001",
      title: "Code of Conduct",
      version: "3.2",
      status: "active",
      effectiveDate: "2026-01-01",
      requiresAcknowledgement: true,
    },
  ];
}

export async function getPendingAcknowledgements(
  employeeId: string,
): Promise<PolicyAcknowledgement[]> {
  void employeeId;
  return [];
}

export async function getUpcomingAudits(): Promise<AuditRecord[]> {
  return [];
}
