// app/api/dashboard/route.ts
//
// Single aggregation endpoint for the Admin Dashboard: GET /api/dashboard?section=<name>
//
// This route now reads from the live MongoDB collections that already exist in the app.
// When a dashboard section has no dedicated collection, the implementation derives the
// metric from the closest available source (for example, users, leaves, payroll, goals,
// and applications).

import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Goal from "@/models/Goal";
import LeaveRequest from "@/models/LeaveRequest";
import PayrollRecord from "@/models/PayrollRecord";
import ResumeAnalysis from "@/models/ResumeAnalysis";
import User from "@/models/User";
import WFHRequests from "@/models/WFHRequests";
import type {
  DashboardSection,
  OverviewResponse,
  WorkforceResponse,
  RecruitmentResponse,
  AttendanceResponse,
  PayrollResponse,
  EmployeeInsightsResponse,
  ActivityItem,
  Employee,
  UpcomingEvent,
  PerformanceMetric,
  OrgHealthMetric,
  NotificationItem,
  SystemStatusInfo,
} from "@/types/admindashboard";

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthLabel(date: Date) {
  return date.toLocaleString("en-US", { month: "short" });
}

function getYearsBetween(date: Date | null, from = new Date()) {
  if (!date) return 0;
  const diff = from.getTime() - new Date(date).getTime();
  return diff / (1000 * 60 * 60 * 24 * 365.25);
}

async function getOverview(): Promise<OverviewResponse> {
  const now = new Date();
  const currentMonth = getMonthKey(now);

  const [users, leaveRequests, payrollRecords, applications] = await Promise.all([
    User.find({ role: { $in: ["EMPLOYEE", "MANAGER"] } }, { role: 1, department: 1 }).lean(),
    LeaveRequest.find({}, { status: 1, startDate: 1, endDate: 1 }).lean(),
    PayrollRecord.find({ month: currentMonth }, { netSalary: 1, status: 1 }).lean(),
    ResumeAnalysis.countDocuments(),
  ]);

  const activeEmployees = users.length;
  const managers = users.filter((user: any) => user.role === "MANAGER").length;
  const departments = new Set(users.map((user: any) => user.department).filter(Boolean)).size;
  const onLeaveToday = leaveRequests.filter((item: any) => {
    if (item.status !== "APPROVED") return false;
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    return start <= now && end >= now;
  }).length;
  const monthlyPayroll = payrollRecords.reduce((sum: number, record: any) => sum + (record.netSalary ?? 0), 0);

  return {
    lastUpdated: now.toISOString(),
    stats: [
      { id: "total-employees", label: "Total Employees", value: activeEmployees, deltaLabel: "Live count", trend: "up", icon: "Users", accent: "indigo" },
      { id: "active-employees", label: "Active Employees", value: activeEmployees, deltaLabel: "From employee records", trend: "up", icon: "UserCheck", accent: "emerald" },
      { id: "departments", label: "Departments", value: departments, deltaLabel: "Distinct departments", trend: "flat", icon: "Building2", accent: "sky" },
      { id: "managers", label: "Managers", value: managers, deltaLabel: "Manager roles", trend: "up", icon: "UserCog", accent: "violet" },
      { id: "open-positions", label: "Open Positions", value: 0, deltaLabel: "No recruitment collection", trend: "flat", icon: "Briefcase", accent: "amber" },
      { id: "new-applications", label: "New Applications", value: applications, deltaLabel: "From resume analysis", trend: "up", icon: "FileText", accent: "rose" },
      { id: "on-leave-today", label: "Employees On Leave Today", value: onLeaveToday, deltaLabel: "Approved leave", trend: "down", icon: "CalendarOff", accent: "teal" },
      { id: "monthly-payroll", label: "Monthly Payroll", value: monthlyPayroll, format: "currency", deltaLabel: "Current month payroll", trend: "up", icon: "Wallet", accent: "slate" },
    ],
  };
}

async function getWorkforce(): Promise<WorkforceResponse> {
  const users = await User.find({ role: { $in: ["EMPLOYEE", "MANAGER"] } }, { department: 1, joiningDate: 1 }).lean();
  const now = new Date();
  const monthBuckets: Array<{ key: string; label: string; employees: number }> = [];

  for (let i = 11; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthBuckets.push({ key: getMonthKey(d), label: getMonthLabel(d), employees: 0 });
  }

  const bucketMap = new Map(monthBuckets.map((bucket) => [bucket.key, bucket]));
  users.forEach((user: any) => {
    if (!user.joiningDate) return;
    const key = getMonthKey(new Date(user.joiningDate));
    if (bucketMap.has(key)) {
      bucketMap.get(key)!.employees += 1;
    }
  });

  let cumulative = 0;
  const growth = monthBuckets.map((bucket) => {
    cumulative += bucket.employees;
    return { month: bucket.label, employees: cumulative };
  });

  const departmentCounts = new Map<string, number>();
  users.forEach((user: any) => {
    const department = user.department || "Unassigned";
    departmentCounts.set(department, (departmentCounts.get(department) ?? 0) + 1);
  });

  const departments = Array.from(departmentCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, value], index) => ({
      name,
      value,
      color: ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6", "#14b8a6"][index] ?? "#64748b",
    }));

  return { growth, departments };
}

async function getRecruitment(): Promise<RecruitmentResponse> {
  const now = new Date();
  const applications = await ResumeAnalysis.find({}, { createdAt: 1 }).lean();
  const months: Array<{ key: string; label: string; applications: number; interviews: number; offers: number }> = [];

  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: getMonthKey(d), label: getMonthLabel(d), applications: 0, interviews: 0, offers: 0 });
  }

  const bucketMap = new Map(months.map((bucket) => [bucket.key, bucket]));
  applications.forEach((item: any) => {
    const key = getMonthKey(new Date(item.createdAt));
    if (bucketMap.has(key)) {
      bucketMap.get(key)!.applications += 1;
    }
  });

  const trend = months.map((bucket) => ({ month: bucket.label, applications: bucket.applications, interviews: bucket.interviews, offers: bucket.offers }));
  const applicationsReceived = applications.length;
  const offersSent = 0;

  return {
    summary: {
      applicationsReceived,
      applicationsDelta: applicationsReceived > 0 ? "+Live data" : "No applications yet",
      interviewsScheduled: 0,
      interviewsDelta: "No interview data",
      offersSent,
      offersDelta: "No offer data",
      hiringSuccessRate: applicationsReceived > 0 ? Math.round((offersSent / applicationsReceived) * 100) : 0,
    },
    trend,
  };
}

async function getAttendance(): Promise<AttendanceResponse> {
  const now = new Date();
  const [users, leaveRequests, wfhRequests] = await Promise.all([
    User.countDocuments({ role: { $in: ["EMPLOYEE", "MANAGER"] } }),
    LeaveRequest.find({}, { status: 1, startDate: 1, endDate: 1 }).lean(),
    WFHRequests.find({ status: "APPROVED" }, { startDate: 1, endDate: 1 }).lean(),
  ]);

  const onLeaveToday = leaveRequests.filter((item: any) => {
    if (item.status !== "APPROVED") return false;
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    return start <= now && end >= now;
  }).length;

  const workFromHome = wfhRequests.filter((item: any) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    return start <= now && end >= now;
  }).length;

  const present = Math.max(0, users - onLeaveToday);
  const absent = Math.max(0, users - present);

  return {
    attendance: { present, absent, late: 0, workFromHome },
    leave: {
      pending: leaveRequests.filter((item: any) => item.status === "PENDING").length,
      approved: leaveRequests.filter((item: any) => item.status === "APPROVED").length,
      rejected: leaveRequests.filter((item: any) => item.status === "REJECTED").length,
      onLeaveToday,
    },
  };
}

async function getPayroll(): Promise<PayrollResponse> {
  const now = new Date();
  const currentMonth = getMonthKey(now);
  const payrollRecords = await PayrollRecord.find({}, { month: 1, netSalary: 1 }).lean();
  const monthBuckets: Array<{ key: string; label: string; amount: number }> = [];

  for (let i = 11; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthBuckets.push({ key: getMonthKey(d), label: getMonthLabel(d), amount: 0 });
  }

  const bucketMap = new Map(monthBuckets.map((bucket) => [bucket.key, bucket]));
  payrollRecords.forEach((record: any) => {
    if (!record.month) return;
    const key = record.month;
    if (bucketMap.has(key)) {
      bucketMap.get(key)!.amount += record.netSalary ?? 0;
    }
  });

  const currentMonthRecords = payrollRecords.filter((record: any) => record.month === currentMonth);
  const totalMonthlyPayroll = currentMonthRecords.reduce((sum: number, record: any) => sum + (record.netSalary ?? 0), 0);
  const averageSalary = currentMonthRecords.length > 0 ? Math.round(totalMonthlyPayroll / currentMonthRecords.length) : 0;

  return {
    summary: {
      totalMonthlyPayroll,
      averageSalary,
      nextProcessingDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString(),
    },
    trend: monthBuckets.map((bucket) => ({ month: bucket.label, amount: bucket.amount })),
  };
}

async function getInsights(): Promise<EmployeeInsightsResponse> {
  const [users, goals] = await Promise.all([
    User.find({ role: { $in: ["EMPLOYEE", "MANAGER"] } }, { gender: 1, employmentType: 1, dateOfBirth: 1, joiningDate: 1 }).lean(),
    Goal.find({}, { progress: 1 }).lean(),
  ]);

  const genderMap = new Map<string, number>();
  const employmentTypeMap = new Map<string, number>();
  let ageTotal = 0;
  let experienceTotal = 0;
  let performanceTotal = 0;

  users.forEach((user: any) => {
    const gender = user.gender || "Other";
    genderMap.set(gender, (genderMap.get(gender) ?? 0) + 1);

    const employmentType = user.employmentType || "Full-time";
    employmentTypeMap.set(employmentType, (employmentTypeMap.get(employmentType) ?? 0) + 1);

    ageTotal += getYearsBetween(user.dateOfBirth);
    experienceTotal += getYearsBetween(user.joiningDate);
  });

  goals.forEach((goal: any) => {
    performanceTotal += goal.progress ?? 0;
  });

  const genderDistribution = Array.from(genderMap.entries()).map(([name, value]) => ({ name, value, color: ["#6366f1", "#f43f5e", "#f59e0b"][Math.min(2, Array.from(genderMap.keys()).indexOf(name))] ?? "#64748b" }));

  return {
    genderDistribution,
    employmentType: {
      fullTime: employmentTypeMap.get("Full-time") ?? 0,
      interns: employmentTypeMap.get("Intern") ?? 0,
      contract: employmentTypeMap.get("Contract") ?? 0,
      remote: employmentTypeMap.get("Remote") ?? 0,
    },
    averageExperienceYears: users.length ? Number((experienceTotal / users.length).toFixed(1)) : 0,
    averageAge: users.length ? Number((ageTotal / users.length).toFixed(1)) : 0,
    averagePerformanceScore: goals.length ? Number((performanceTotal / goals.length).toFixed(1)) : 0,
  };
}

async function getActivities(): Promise<ActivityItem[]> {
  const now = Date.now();
  const [users, leaveRequests, payrollRecords, goals] = await Promise.all([
    User.find({}, { name: 1, department: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(5).lean(),
    LeaveRequest.find({}, { employeeName: 1, status: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(5).lean(),
    PayrollRecord.find({}, { month: 1, status: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(5).lean(),
    Goal.find({}, { title: 1, progress: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const items: ActivityItem[] = [];
  users.forEach((user: any) => {
    items.push({ id: `user-${user._id ?? user.name}`, type: "employee_added", actor: user.name, description: `joined ${user.department || "the organization"}`, timestamp: new Date(user.createdAt ?? now).toISOString(), status: "success" });
  });
  leaveRequests.forEach((item: any) => {
    items.push({ id: `leave-${item._id ?? item.employeeName}`, type: "leave_approved", actor: item.employeeName, description: `leave request is ${item.status.toLowerCase()}`, timestamp: new Date(item.createdAt ?? now).toISOString(), status: item.status === "APPROVED" ? "success" : "pending" });
  });
  payrollRecords.forEach((item: any) => {
    items.push({ id: `payroll-${item._id ?? item.month}`, type: "payroll_processed", actor: "Payroll", description: `processed ${item.month ?? "payroll"}`, timestamp: new Date(item.createdAt ?? now).toISOString(), status: item.status === "PAID" ? "success" : "info" });
  });
  goals.forEach((item: any) => {
    items.push({ id: `goal-${item._id ?? item.title}`, type: "performance_review", actor: "Goal", description: `${item.title} is ${item.progress ?? 0}% complete`, timestamp: new Date(item.createdAt ?? now).toISOString(), status: "pending" });
  });

  return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 12);
}

async function getEmployees(): Promise<Employee[]> {
  const now = new Date();
  const [users, leaveRequests] = await Promise.all([
    User.find({ role: { $in: ["EMPLOYEE", "MANAGER"] } }, { userId: 1, name: 1, department: 1, designation: 1, manager: 1, joiningDate: 1, role: 1 }).sort({ joiningDate: -1 }).limit(8).lean(),
    LeaveRequest.find({ status: "APPROVED" }, { employeeId: 1, startDate: 1, endDate: 1 }).lean(),
  ]);

  return users.map((user: any) => {
    const onLeave = leaveRequests.some((item: any) => {
      if (item.employeeId !== user.userId) return false;
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      return start <= now && end >= now;
    });

    return {
      id: user.userId,
      employeeId: user.userId,
      name: user.name,
      department: user.department ?? "",
      role: user.designation ?? user.role,
      manager: user.manager ?? "",
      status: onLeave ? "onleave" : "active",
      joiningDate: user.joiningDate ? new Date(user.joiningDate).toISOString() : new Date().toISOString(),
    };
  });
}

async function getEvents(): Promise<UpcomingEvent[]> {
  const now = new Date();
  const users = await User.find({ role: { $in: ["EMPLOYEE", "MANAGER"] } }, { name: 1, dateOfBirth: 1, joiningDate: 1 }).lean();
  const events: UpcomingEvent[] = [];

  users.forEach((user: any, index: number) => {
    if (user.dateOfBirth) {
      const date = new Date(user.dateOfBirth);
      const nextBirthday = new Date(now.getFullYear(), date.getMonth(), date.getDate());
      if (nextBirthday < now) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
      events.push({ id: `birthday-${index}`, category: "birthday", title: `${user.name}'s birthday`, date: nextBirthday.toISOString() });
    }

    if (user.joiningDate) {
      const date = new Date(user.joiningDate);
      const nextAnniversary = new Date(now.getFullYear(), date.getMonth(), date.getDate());
      if (nextAnniversary < now) nextAnniversary.setFullYear(nextAnniversary.getFullYear() + 1);
      events.push({ id: `anniversary-${index}`, category: "anniversary", title: `${user.name} anniversary`, date: nextAnniversary.toISOString() });
    }
  });

  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 6);
}

async function getPerformance(): Promise<PerformanceMetric[]> {
  const [goals, certificates] = await Promise.all([Goal.find({}, { progress: 1 }).lean(), ResumeAnalysis.countDocuments()]);
  const averageGoalProgress = goals.length ? Math.round(goals.reduce((sum: number, goal: any) => sum + (goal.progress ?? 0), 0) / goals.length) : 0;
  const trainingCompletion = certificates > 0 ? Math.round((certificates / Math.max(1, certificates)) * 100) : 0;

  return [
    { id: "kpi", label: "Average KPI Score", value: averageGoalProgress, deltaLabel: "From goals" },
    { id: "goals", label: "Goal Completion", value: averageGoalProgress, deltaLabel: "Current goal progress" },
    { id: "training", label: "Training Completion", value: trainingCompletion, deltaLabel: "Resume records" },
    { id: "satisfaction", label: "Employee Satisfaction", value: 0, deltaLabel: "No survey data" },
    { id: "retention", label: "Retention Rate", value: 0, deltaLabel: "No exit data" },
  ];
}

async function getOrgHealth(): Promise<OrgHealthMetric[]> {
  const [users, leaveRequests, payrollRecords, goals] = await Promise.all([
    User.countDocuments({ role: { $in: ["EMPLOYEE", "MANAGER"] } }),
    LeaveRequest.find({ status: "APPROVED" }, { startDate: 1, endDate: 1 }).lean(),
    PayrollRecord.find({ status: "PAID" }).lean(),
    Goal.find({}, { progress: 1 }).lean(),
  ]);
  const now = new Date();
  const onLeaveToday = leaveRequests.filter((item: any) => {
    const start = new Date(item.startDate);
    const end = new Date(item.endDate);
    return start <= now && end >= now;
  }).length;
  const attendanceRate = users > 0 ? Math.max(0, 100 - Math.round((onLeaveToday / users) * 100)) : 100;
  const payrollCompletion = payrollRecords.length > 0 ? 100 : 0;
  const trainingCompletion = goals.length > 0 ? Math.round(goals.reduce((sum: number, goal: any) => sum + (goal.progress ?? 0), 0) / goals.length) : 0;

  return [
    { id: "turnover", label: "Employee Turnover", value: onLeaveToday, status: "good" },
    { id: "hiring-velocity", label: "Hiring Velocity", value: 0, status: "good" },
    { id: "attrition", label: "Attrition Rate", value: 0, status: "good" },
    { id: "avg-attendance", label: "Average Attendance", value: attendanceRate, status: attendanceRate >= 90 ? "good" : "warning" },
    { id: "payroll-completion", label: "Payroll Completion", value: payrollCompletion, status: payrollCompletion === 100 ? "good" : "warning" },
    { id: "training-completion", label: "Training Completion", value: trainingCompletion, status: trainingCompletion >= 70 ? "good" : "warning" },
  ];
}

async function getNotifications(): Promise<NotificationItem[]> {
  const [leaveRequests, applications, payrollRecords] = await Promise.all([
    LeaveRequest.find({ status: "PENDING" }).lean(),
    ResumeAnalysis.countDocuments(),
    PayrollRecord.find({ status: { $ne: "PAID" } }).lean(),
  ]);

  return [
    { id: "n1", label: "Pending Leave Requests", count: leaveRequests.length, severity: leaveRequests.length > 0 ? "warning" : "info" },
    { id: "n2", label: "New Applications", count: applications, severity: applications > 0 ? "info" : "warning" },
    { id: "n3", label: "Payroll Pending Approval", count: payrollRecords.length, severity: payrollRecords.length > 0 ? "critical" : "info" },
    { id: "n4", label: "Contracts Expiring Soon", count: 0, severity: "info" },
    { id: "n5", label: "Probation Ending", count: 0, severity: "info" },
    { id: "n6", label: "Unread Messages", count: 0, severity: "info" },
  ];
}

async function getSystem(): Promise<SystemStatusInfo> {
  const [users, leaveRequests, payrollRecords, goals, applications] = await Promise.all([
    User.countDocuments(),
    LeaveRequest.countDocuments(),
    PayrollRecord.countDocuments(),
    Goal.countDocuments(),
    ResumeAnalysis.countDocuments(),
  ]);

  return {
    totalRecords: users + leaveRequests + payrollRecords + goals + applications,
    lastBackup: new Date(Date.now() - 6 * 3600_000).toISOString(),
    serverStatus: "operational",
    apiStatus: "operational",
    version: "v2.14.0",
  };
}

const handlers: Record<DashboardSection, () => Promise<unknown>> = {
  overview: getOverview,
  workforce: getWorkforce,
  recruitment: getRecruitment,
  attendance: getAttendance,
  payroll: getPayroll,
  insights: getInsights,
  activities: getActivities,
  employees: getEmployees,
  events: getEvents,
  performance: getPerformance,
  orgHealth: getOrgHealth,
  notifications: getNotifications,
  system: getSystem,
};

export async function GET(request: NextRequest) {
  const section = request.nextUrl.searchParams.get("section") as DashboardSection | null;

  if (!section || !(section in handlers)) {
    return NextResponse.json(
      { error: `Unknown or missing "section" query param. Valid values: ${Object.keys(handlers).join(", ")}` },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const data = await handlers[section]();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(`[dashboard api] failed to load section "${section}"`, err);
    return NextResponse.json({ error: "Failed to load dashboard data." }, { status: 500 });
  }
}
