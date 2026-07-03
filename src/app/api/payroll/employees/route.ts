import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import LeaveRequest from "@/models/LeaveRequest";
import WFHRequests from "@/models/WFHRequests";
import PayrollRecord from "@/models/PayrollRecord";
import { NextResponse } from "next/server";

// Salary bands (₹ per month) keyed by designation keyword — fallback if no salary field exists on User
const SALARY_BAND: Record<string, number> = {
  intern: 15000,
  junior: 35000,
  senior: 80000,
  lead: 120000,
  manager: 150000,
  director: 250000,
  vp: 350000,
  default: 50000,
};

function estimateSalary(designation: string): number {
  const d = (designation ?? "").toLowerCase();
  for (const [key, val] of Object.entries(SALARY_BAND)) {
    if (key !== "default" && d.includes(key)) return val;
  }
  return SALARY_BAND.default;
}

function getWorkingDaysInMonth(year: number, month: number): number {
  const days = new Date(year, month + 1, 0).getDate();
  let working = 0;
  for (let d = 1; d <= days; d++) {
    const day = new Date(year, month, d).getDay();
    if (day !== 0 && day !== 6) working++;
  }
  return working;
}

function daysInRange(start: Date, end: Date, year: number, month: number): number {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const from = start < monthStart ? monthStart : start;
  const to = end > monthEnd ? monthEnd : end;
  if (from > to) return 0;
  let count = 0;
  const cur = new Date(from);
  while (cur <= to) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const monthParam = url.searchParams.get("month"); // "YYYY-MM"
    const now = new Date();
    const year = monthParam ? parseInt(monthParam.split("-")[0]) : now.getFullYear();
    const month = monthParam ? parseInt(monthParam.split("-")[1]) - 1 : now.getMonth();

    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);

    // Fetch all users (employees + managers)
    const users = await User.find(
      { role: { $in: ["EMPLOYEE", "MANAGER"] } },
      {
        userId: 1,
        name: 1,
        email: 1,
        role: 1,
        department: 1,
        designation: 1,
        joiningDate: 1,
        employmentType: 1,
        workLocation: 1,
        profileImage: 1,
        manager: 1,
        phone: 1,
        gender: 1,
        dateOfBirth: 1,
        address: 1,
      }
    ).lean();

    const employeeIds = users.map((u) => u.userId);

    // Fetch approved leaves for all employees in this month
    const leaves = await LeaveRequest.find({
      employeeId: { $in: employeeIds },
      status: "APPROVED",
      $or: [
        { startDate: { $lte: monthEnd }, endDate: { $gte: monthStart } },
      ],
    }).lean();

    // Fetch approved WFH requests for all employees in this month
    const wfhs = await WFHRequests.find({
      employeeId: { $in: employeeIds },
      status: "APPROVED",
      $or: [
        { startDate: { $lte: monthEnd }, endDate: { $gte: monthStart } },
      ],
    }).lean();

    const workingDays = getWorkingDaysInMonth(year, month);
    const perDayRate = (salary: number) => salary / workingDays;

    const result = users.map((user) => {
      const grossSalary = estimateSalary(user.designation ?? "");

      // Leaves for this employee this month
      const empLeaves = leaves
        .filter((l) => l.employeeId === user.userId)
        .map((l) => {
          const days = l.isHalfDay
            ? 0.5
            : daysInRange(new Date(l.startDate), new Date(l.endDate), year, month);
          return { ...l, calculatedDays: days };
        });

      // WFH records for this employee this month
      const empWFH = wfhs
        .filter((w) => w.employeeId === user.userId)
        .map((w) => {
          const days = daysInRange(new Date(w.startDate), new Date(w.endDate), year, month);
          return { ...w, calculatedDays: days };
        });

      const totalLeaveDays = empLeaves.reduce((acc, l) => acc + l.calculatedDays, 0);
      const totalWFHDays = empWFH.reduce((acc, w) => acc + w.calculatedDays, 0);

      // Deductions: unpaid leaves (simple model — all leave days are LOP)
      const lopDays = Math.max(0, totalLeaveDays - 1.5); // 1.5 days grace per month
      const lopDeduction = lopDays * perDayRate(grossSalary);

      // Standard deductions
      const pf = Math.round(grossSalary * 0.12);        // 12% PF
      const tax = Math.round(grossSalary * 0.10);        // 10% TDS
      const professionalTax = 200;                        // flat ₹200

      const totalDeductions = Math.round(lopDeduction) + pf + tax + professionalTax;
      const netSalary = Math.max(0, grossSalary - totalDeductions);

      return {
        // Employee info
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        employmentType: user.employmentType,
        workLocation: user.workLocation,
        joiningDate: user.joiningDate,
        profileImage: user.profileImage,
        manager: user.manager,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        // Salary breakdown
        grossSalary,
        workingDays,
        totalLeaveDays,
        totalWFHDays,
        lopDays: parseFloat(lopDays.toFixed(2)),
        lopDeduction: Math.round(lopDeduction),
        pf,
        tax,
        professionalTax,
        totalDeductions,
        netSalary,
        // Raw records
        leaves: empLeaves,
        wfhRequests: empWFH,
      };
    });

    // Fetch existing PayrollRecord statuses for this month
    const payrollRecords = await PayrollRecord.find({
      employeeId: { $in: employeeIds },
      month: `${year}-${String(month + 1).padStart(2, "0")}`,
    }).lean();

    const recordByEmpId = new Map(
      payrollRecords.map((r) => [r.employeeId, r])
    );

    const resultWithStatus = result.map((emp) => {
      const rec = recordByEmpId.get(emp.userId);
      return {
        ...emp,
        payrollStatus: rec?.status ?? "PENDING",
        submittedAt: rec?.submittedAt ?? null,
        creditedDate: rec?.creditedDate ?? null,
      };
    });

    return NextResponse.json({ employees: resultWithStatus, month: `${year}-${String(month + 1).padStart(2, "0")}`, workingDays }, { status: 200 });
  } catch (error) {
    console.error("GET /api/payroll/employees error:", error);
    return NextResponse.json({ message: "Failed to fetch payroll data" }, { status: 500 });
  }
}

// ─── PATCH — submit payroll for one employee ───────────────────────────────────
export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      employeeId,
      employeeName,
      month,          // "YYYY-MM"
      grossSalary,
      totalDeductions,
      netSalary,
      pf,
      tax,
      professionalTax,
      lopDeduction,
      lopDays,
      totalLeaveDays,
      totalWFHDays,
      workingDays,
      submittedBy,
    } = body;

    if (!employeeId || !month) {
      return NextResponse.json({ message: "employeeId and month are required" }, { status: 400 });
    }

    // Credit date = last day of the month
    const [y, m] = month.split("-").map(Number);
    const creditedDate = new Date(y, m, 0); // day 0 of next month = last day of current

    const record = await PayrollRecord.findOneAndUpdate(
      { employeeId, month },
      {
        $set: {
          employeeName: employeeName ?? "",
          month,
          grossSalary: grossSalary ?? 0,
          totalDeductions: totalDeductions ?? 0,
          netSalary: netSalary ?? 0,
          pf: pf ?? 0,
          tax: tax ?? 0,
          professionalTax: professionalTax ?? 0,
          lopDeduction: lopDeduction ?? 0,
          lopDays: lopDays ?? 0,
          totalLeaveDays: totalLeaveDays ?? 0,
          totalWFHDays: totalWFHDays ?? 0,
          workingDays: workingDays ?? 0,
          status: "SUBMITTED",
          submittedAt: new Date(),
          creditedDate,
          submittedBy: submittedBy ?? "",
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { success: true, message: "Payroll submitted successfully", record },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/payroll/employees error:", error);
    return NextResponse.json({ message: "Failed to submit payroll" }, { status: 500 });
  }
}
