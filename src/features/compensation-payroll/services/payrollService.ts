import type {
  BenefitEnrollment,
  PayrollFilters,
  PayrollRun,
  Payslip,
  PtoBalance,
  PtoRequest,
} from "../types";

export async function getPayslips(filters?: PayrollFilters): Promise<Payslip[]> {
  const payslips: Payslip[] = [
    {
      id: "pay_001",
      employeeId: filters?.employeeId ?? "emp_001",
      periodStart: "2026-05-01",
      periodEnd: "2026-05-31",
      grossPay: 8500,
      netPay: 6200,
      currency: "USD",
      status: "paid",
    },
  ];

  return payslips.filter((slip) => {
    if (filters?.employeeId && slip.employeeId !== filters.employeeId) return false;
    if (filters?.status && slip.status !== filters.status) return false;
    return true;
  });
}

export async function getPayslipsByEmployee(
  employeeId: string,
): Promise<Payslip[]> {
  return getPayslips({ employeeId });
}

export async function getPtoBalance(employeeId: string): Promise<PtoBalance | null> {
  void employeeId;
  return {
    employeeId,
    accrued: 20,
    used: 8,
    remaining: 12,
    unit: "days",
  };
}

export async function getPayrollRuns(): Promise<PayrollRun[]> {
  return [
    {
      id: "run_001",
      period: "2026-05",
      status: "completed",
      processedAt: new Date().toISOString(),
      employeeCount: 248,
    },
  ];
}

export async function processPayrollRun(runId: string): Promise<void> {
  void runId;
}

export async function getPtoRequests(employeeId: string): Promise<PtoRequest[]> {
  void employeeId;
  return [];
}

export async function getBenefitEnrollments(
  employeeId: string,
): Promise<BenefitEnrollment[]> {
  void employeeId;
  return [];
}
