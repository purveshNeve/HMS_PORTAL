export type PayslipStatus = "draft" | "processed" | "paid";

export interface Payslip {
  id: string;
  employeeId: string;
  periodStart: string;
  periodEnd: string;
  grossPay: number;
  netPay: number;
  currency: string;
  status: PayslipStatus;
}

export interface PayrollFilters {
  employeeId?: string;
  status?: PayslipStatus;
}

export interface PayrollRun {
  id: string;
  period: string;
  periodLabel?: string;
  employeeCount: number;
  totalGross?: number;
  status: "draft" | "pending" | "processing" | "completed" | "paid" | "failed";
  processedAt?: string;
}

export interface PtoRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: "vacation" | "sick" | "personal";
  status: "pending" | "approved" | "rejected";
  reason?: string;
}

export interface BenefitEnrollment {
  id: string;
  employeeId: string;
  planName: string;
  coverageLevel: "individual" | "family";
  effectiveDate: string;
}

export interface CreatePtoRequestInput {
  startDate: string;
  endDate: string;
  type: PtoRequest["type"];
  reason?: string;
}

export interface PtoBalance {
  employeeId: string;
  accrued: number;
  used: number;
  remaining: number;
  unit: "days" | "hours";
}
