import { NextResponse } from "next/server";

import {
  getPayrollRuns,
  getPayslips,
  getPtoBalance,
  processPayrollRun,
} from "@/features/compensation-payroll/services/payrollService";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const employeeId = searchParams.get("employeeId") ?? session.user.id;

  try {
    const [payslips, ptoBalance, payrollRuns] = await Promise.all([
      getPayslips({ employeeId }),
      getPtoBalance(employeeId),
      getPayrollRuns(),
    ]);

    return NextResponse.json({
      success: true,
      data: { payslips, ptoBalance, payrollRuns },
    });
  } catch (error) {
    console.error("[API /payroll]", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch payroll data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { action: string; runId?: string };

    if (body.action === "process" && body.runId) {
      await processPayrollRun(body.runId);
      return NextResponse.json({ success: true, message: "Payroll run initiated" });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("[API /payroll POST]", error);
    return NextResponse.json(
      { success: false, message: "Failed to process payroll request" },
      { status: 500 },
    );
  }
}
