"use client";

import { useCallback, useEffect, useState } from "react";

import type { Payslip } from "../types";

export function usePayroll(employeeId: string) {
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayslips = useCallback(async () => {
    if (!employeeId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { getPayslipsByEmployee } = await import("../services/payrollService");
      const data = await getPayslipsByEmployee(employeeId);
      setPayslips(data);
    } catch {
      setError("Unable to load payslips.");
    } finally {
      setIsLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    void fetchPayslips();
  }, [fetchPayslips]);

  return { payslips, isLoading, error, refetch: fetchPayslips };
}
