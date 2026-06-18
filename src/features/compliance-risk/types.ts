export type PolicyStatus = "draft" | "active" | "archived";

export interface Policy {
  id: string;
  title: string;
  version: string;
  status: PolicyStatus;
  effectiveDate: string;
  requiresAcknowledgement: boolean;
}

export interface PolicyAcknowledgement {
  id: string;
  policyId: string;
  employeeId: string;
  signedAt?: string;
  status: "pending" | "signed" | "overdue";
}

export interface AuditRecord {
  id: string;
  title: string;
  auditor: string;
  scheduledDate: string;
  status: "scheduled" | "in_progress" | "completed" | "failed";
  findingsCount: number;
}

export type AuditSeverity = "low" | "medium" | "high" | "critical";

export interface AuditEvent {
  id: string;
  title: string;
  domain: string;
  severity: AuditSeverity;
  occurredAt: string | Date;
  resolved: boolean;
}

export interface SignPolicyInput {
  policyId: string;
  employeeId: string;
}
