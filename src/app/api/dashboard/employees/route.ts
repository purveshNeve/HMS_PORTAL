import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import LeaveRequest from "@/models/LeaveRequest";
import WFHRequests from "@/models/WFHRequests";
import PayrollRecord from "@/models/PayrollRecord";
import { NextResponse } from "next/server";

// Reuse the same salary estimation logic
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

function yearsFromDate(date: Date | null): number {
  if (!date) return 0;
  const ms = Date.now() - new Date(date).getTime();
  return ms / (1000 * 60 * 60 * 24 * 365.25);
}

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);

    // Fetch all employees and managers
    const users = await User.find(
      { role: { $in: ["EMPLOYEE", "MANAGER"] } },
      {
        userId: 1, name: 1, email: 1, role: 1, department: 1,
        designation: 1, joiningDate: 1, employmentType: 1,
        workLocation: 1, profileImage: 1, manager: 1,
        phone: 1, gender: 1, dateOfBirth: 1, address: 1,
        emergencyContactName: 1,
      }
    ).lean();

    const employeeIds = users.map((u) => u.userId);

    // Approved leaves this month
    const leaves = await LeaveRequest.find({
      employeeId: { $in: employeeIds },
      status: "APPROVED",
      startDate: { $lte: monthEnd },
      endDate: { $gte: monthStart },
    }).lean();

    // Current (ongoing) leaves
    const onLeaveNow = await LeaveRequest.find({
      employeeId: { $in: employeeIds },
      status: "APPROVED",
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).lean();

    // WFH this month
    const wfhs = await WFHRequests.find({
      employeeId: { $in: employeeIds },
      status: "APPROVED",
      startDate: { $lte: monthEnd },
      endDate: { $gte: monthStart },
    }).lean();

    // Payroll records
    const payrollRecords = await PayrollRecord.find({
      employeeId: { $in: employeeIds },
      month: monthStr,
    }).lean();

    const payrollByEmpId = new Map(payrollRecords.map((r) => [r.employeeId, r]));

    // Build enriched employee list
    const employees = users.map((u) => {
      const monthlySalary = estimateSalary(u.designation ?? "");
      const annualCTC = monthlySalary * 12;
      const tenure = yearsFromDate(u.joiningDate);
      const empLeaves = leaves.filter((l) => l.employeeId === u.userId);
      const empWFH = wfhs.filter((w) => w.employeeId === u.userId);
      const payroll = payrollByEmpId.get(u.userId);
      const onLeave = onLeaveNow.some((l) => l.employeeId === u.userId);

      // Profile completeness checks
      const hasPhone = !!u.phone;
      const hasAddress = !!u.address;
      const hasEmergencyContact = !!u.emergencyContactName;
      const profileComplete = hasPhone && hasAddress && hasEmergencyContact && !!u.dateOfBirth && !!u.gender;

      // Upcoming anniversary (within 30 days)
      let daysToAnniversary: number | null = null;
      if (u.joiningDate) {
        const joining = new Date(u.joiningDate);
        const thisYear = new Date(year, joining.getMonth(), joining.getDate());
        const nextYear = new Date(year + 1, joining.getMonth(), joining.getDate());
        const candidate = thisYear >= now ? thisYear : nextYear;
        daysToAnniversary = Math.ceil((candidate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      }

      return {
        userId: u.userId,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department ?? "",
        designation: u.designation ?? "",
        employmentType: u.employmentType ?? "Full-time",
        workLocation: u.workLocation ?? "",
        joiningDate: u.joiningDate ?? null,
        profileImage: u.profileImage ?? null,
        manager: u.manager ?? "",
        gender: u.gender ?? "",
        monthlySalary,
        annualCTC,
        tenureYears: parseFloat(tenure.toFixed(2)),
        onLeave,
        leavesThisMonth: empLeaves.length,
        wfhThisMonth: empWFH.length,
        payrollStatus: payroll?.status ?? "PENDING",
        profileComplete,
        hasPhone,
        hasAddress,
        hasEmergencyContact,
        daysToAnniversary,
      };
    });

    // Group by department for charts
    const deptMap: Record<string, { count: number; totalSalary: number }> = {};
    employees.forEach((e) => {
      const dept = e.department || "Unassigned";
      if (!deptMap[dept]) deptMap[dept] = { count: 0, totalSalary: 0 };
      deptMap[dept].count++;
      deptMap[dept].totalSalary += e.monthlySalary;
    });
    const departmentBreakdown = Object.entries(deptMap).map(([dept, v]) => ({
      department: dept,
      count: v.count,
      totalMonthlySalary: v.totalSalary,
      totalAnnualSalary: v.totalSalary * 12,
    }));

    // Salary distribution buckets (monthly in ₹)
    const buckets = [
      { label: "0–5 LPA", min: 0, max: 41667, count: 0 },
      { label: "5–10 LPA", min: 41667, max: 83333, count: 0 },
      { label: "10–20 LPA", min: 83333, max: 166667, count: 0 },
      { label: "20–30 LPA", min: 166667, max: 250000, count: 0 },
      { label: "30+ LPA", min: 250000, max: Infinity, count: 0 },
    ];
    employees.forEach((e) => {
      const b = buckets.find((bk) => e.monthlySalary > bk.min && e.monthlySalary <= bk.max);
      if (b) b.count++;
    });

    // Employment type distribution
    const empTypeMap: Record<string, number> = {};
    employees.forEach((e) => {
      empTypeMap[e.employmentType] = (empTypeMap[e.employmentType] ?? 0) + 1;
    });

    // Designation salary averages
    const desgMap: Record<string, { total: number; count: number }> = {};
    employees.forEach((e) => {
      const d = e.designation || "Other";
      if (!desgMap[d]) desgMap[d] = { total: 0, count: 0 };
      desgMap[d].total += e.monthlySalary;
      desgMap[d].count++;
    });
    const designationSalaries = Object.entries(desgMap)
      .map(([d, v]) => ({ designation: d, avgMonthly: Math.round(v.total / v.count), count: v.count }))
      .sort((a, b) => b.avgMonthly - a.avgMonthly)
      .slice(0, 10);

    // KPIs
    const totalEmployees = employees.length;
    const totalMonthlyPayroll = employees.reduce((s, e) => s + e.monthlySalary, 0);
    const totalAnnualCTC = totalMonthlyPayroll * 12;
    const avgMonthlySalary = totalEmployees ? Math.round(totalMonthlyPayroll / totalEmployees) : 0;
    const avgTenure = totalEmployees
      ? parseFloat((employees.reduce((s, e) => s + e.tenureYears, 0) / totalEmployees).toFixed(2))
      : 0;

    const remoteCount = employees.filter((e) =>
      (e.workLocation ?? "").toLowerCase().includes("remote")
    ).length;
    const officeCount = totalEmployees - remoteCount;

    const onLeaveCount = employees.filter((e) => e.onLeave).length;
    const totalLeavesThisMonth = leaves.length;
    const totalWFHThisMonth = wfhs.length;

    const incompleteProfiles = employees.filter((e) => !e.profileComplete).length;
    const missingPhone = employees.filter((e) => !e.hasPhone).length;
    const missingEmergencyContact = employees.filter((e) => !e.hasEmergencyContact).length;

    const payrollSubmitted = payrollRecords.filter((r) =>
      ["SUBMITTED", "PROCESSED", "PAID"].includes(r.status)
    ).length;
    const payrollPending = totalEmployees - payrollSubmitted;

    // Upcoming anniversaries (within 30 days)
    const upcomingAnniversaries = employees
      .filter((e) => e.daysToAnniversary !== null && e.daysToAnniversary! >= 0 && e.daysToAnniversary! <= 30)
      .sort((a, b) => (a.daysToAnniversary ?? 999) - (b.daysToAnniversary ?? 999))
      .slice(0, 5);

    // Recently joined (last 60 days)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const recentlyJoined = employees
      .filter((e) => e.joiningDate && new Date(e.joiningDate) >= sixtyDaysAgo)
      .sort((a, b) => new Date(b.joiningDate!).getTime() - new Date(a.joiningDate!).getTime())
      .slice(0, 5);

    // Longest tenure
    const longestTenure = [...employees].sort((a, b) => b.tenureYears - a.tenureYears).slice(0, 3);

    // Highest & Lowest paid
    const sortedBySalary = [...employees].sort((a, b) => b.monthlySalary - a.monthlySalary);
    const highestPaid = sortedBySalary.slice(0, 3);
    const lowestPaid = sortedBySalary.slice(-3).reverse();

    return NextResponse.json({
      ok: true,
      meta: { generatedAt: now.toISOString(), month: monthStr },
      kpis: {
        totalEmployees,
        totalMonthlyPayroll,
        totalAnnualCTC,
        avgMonthlySalary,
        avgTenure,
        remoteCount,
        officeCount,
        onLeaveCount,
        totalLeavesThisMonth,
        totalWFHThisMonth,
        incompleteProfiles,
        missingPhone,
        missingEmergencyContact,
        payrollSubmitted,
        payrollPending,
      },
      charts: {
        salaryDistribution: buckets,
        departmentBreakdown,
        employmentTypeDistribution: Object.entries(empTypeMap).map(([type, count]) => ({ type, count })),
        designationSalaries,
      },
      insights: {
        highestPaid,
        lowestPaid,
        longestTenure,
        recentlyJoined,
        upcomingAnniversaries,
        incompleteProfileEmployees: employees
          .filter((e) => !e.profileComplete)
          .slice(0, 8),
      },
      employees,
    });
  } catch (error) {
    console.error("GET /api/dashboard/employees error:", error);
    return NextResponse.json({ ok: false, message: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
