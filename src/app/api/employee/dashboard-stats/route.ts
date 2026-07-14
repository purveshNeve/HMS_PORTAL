import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import LeaveRequest from "@/models/LeaveRequest";
import WFHRequests from "@/models/WFHRequests";
import GoalModel from "@/models/Goal";
import PayrollRecord from "@/models/PayrollRecord";
import { NextResponse } from "next/server";
import Meeting from "@/models/Meeting";
import { any } from "zod";
import Goal from "@/models/Goal";

function getWeekStart(date: Date) {
  const day = date.getDay();
  const diff = (day + 6) % 7; // Monday as first day
  const start = new Date(date);
  start.setDate(date.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function isDateInRange(date: Date, start: Date, end: Date) {
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const employeeId = session.user.userId;
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;

    // Get the first and last day of current month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // 1. Fetch approved leaves for current month
    const approvedLeaves = await LeaveRequest.find({
      employeeId,
      status: "APPROVED",
      startDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    }).lean();

    // Calculate total leave days (accounting for half days)
    let totalLeaveDays = 0;
    approvedLeaves.forEach((leave) => {
      const startDate = new Date(leave.startDate);
      const endDate = new Date(leave.endDate);
      let days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      if (leave.isHalfDay) {
        days = 0.5;
      }
      totalLeaveDays += days;
    });

    //fetch the Upcoming details :
    const meetings = await Meeting.find({
      attendees: {  
        $in: ["all", employeeId]
      }
    }).lean();

    const projectDeadline = await Goal.find({
      employeeId,
    })

    // fetch the total salary for the previous month
    const payrollNet = await PayrollRecord.findOne(
      { employeeId },
      { netSalary: 1, _id: 0 }
    ).lean();
    const prevMonthSal = payrollNet?.netSalary ?? 0;
    
    // 2. Fetch approved WFH requests for current month
    const approvedWFH = await WFHRequests.find({
      employeeId,
      status: "APPROVED",
      startDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    }).lean();

    // Calculate total WFH days
    let totalWFHDays = 0;
    approvedWFH.forEach((wfh) => {
      const startDate = new Date(wfh.startDate);
      const endDate = new Date(wfh.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      totalWFHDays += days;
    });

    const weekStart = getWeekStart(currentDate);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weeklyLeaves = await LeaveRequest.find({
      employeeId,
      status: "APPROVED",
      startDate: { $lte: weekEnd },
      endDate: { $gte: weekStart },
    }).lean();

    const weeklyWFH = await WFHRequests.find({
      employeeId,
      status: "APPROVED",
      startDate: { $lte: weekEnd },
      endDate: { $gte: weekStart },
    }).lean();

    const weeklyAttendance = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + index);
      day.setHours(0, 0, 0, 0);

      const isAbsent = weeklyLeaves.some((leave) => {
        const startDate = new Date(leave.startDate);
        const endDate = new Date(leave.endDate);
        return isDateInRange(day, startDate, endDate);
      });

      const isRemote = !isAbsent && weeklyWFH.some((wfh) => {
        const startDate = new Date(wfh.startDate);
        const endDate = new Date(wfh.endDate);
        return isDateInRange(day, startDate, endDate);
      });

      return {
        day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
        present: isAbsent || isRemote ? 0 : 1,
        remote: isRemote ? 1 : 0,
        absent: isAbsent ? 1 : 0,
      };
    });

    // 3. Fetch pending tasks/goals
    const pendingGoals = await GoalModel.find({
      assignedTo: employeeId,
      status: { $in: ["not_started", "in_progress"] },
    }).lean();

    const pendingTasksCount = pendingGoals.length;

    // 4. Calculate working days in current month (excluding weekends)
    let workingDays = 0;
    for (let day = 1; day <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(); day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayOfWeek = date.getDay();
      // Exclude Saturday (6) and Sunday (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
    }

    // Calculate attendance (working days - leaves - WFH)
    const calculatedAttendance = Math.max(0, workingDays - totalLeaveDays - totalWFHDays);

    // 5. Fetch payroll info for current month
    const payroll = await PayrollRecord.findOne({
      employeeId,
      month: currentMonth,
    }).lean();

    //Calculate payroll based on base salary and leave deductions
    const payrollGross = await PayrollRecord.findOne(
      { employeeId },
      { grossSalary: 1, _id: 0 }
    ).lean();
    const baseSalary = payrollGross?.grossSalary ?? 45000;
    const dailyRate = workingDays > 0 ? baseSalary / workingDays : 0;
    const salaryLostToLeaves = totalLeaveDays * dailyRate;
    const calculatedPayroll = Math.max(0, baseSalary - salaryLostToLeaves);

    const latestPayroll = await PayrollRecord.findOne({ employeeId }).sort({ creditedDate: -1 }).lean();

    const creditDate = latestPayroll?.creditedDate ? new Date(latestPayroll.creditedDate).toISOString() : null;

    return NextResponse.json(
      {
        stats: {
          attendance: calculatedAttendance,
          leaves: Math.round(totalLeaveDays * 10) / 10,
          wfhLeaves: Math.round(totalWFHDays * 10) / 10,
          payroll: Math.round(calculatedPayroll),
          tasks: pendingTasksCount,
        },
        UpcomingEvents: {
          meetings,
          projectDeadline,
        },
        payrollBreakdown: {
          baseSalary,
          workingDays,
          prevMonthSal,
          creditDate,
          dailyRate: Math.round(dailyRate * 100) / 100,
          totalLeaveDays: Math.round(totalLeaveDays * 10) / 10,
          salaryLostToLeaves: Math.round(salaryLostToLeaves * 100) / 100,
          netPayroll: Math.round(calculatedPayroll),
        },
        details: {
          approvedLeaves: approvedLeaves.map((leave) => ({
            type: leave.leaveType,
            date: `${new Date(leave.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} - ${new Date(leave.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`,
            status: "Approved",
            color: "bg-emerald-100 text-emerald-700",
          })),
          approvedWFH: approvedWFH.map((wfh) => ({
            type: "WFH",
            date: `${new Date(wfh.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} - ${new Date(wfh.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}`,
            status: "Approved",
            color: "bg-emerald-100 text-emerald-700",
          })),
          pendingGoals: pendingGoals.map((goal) => ({
            id: goal._id,
            title: goal.title,
            dueDate: goal.dueDate,
            priority: goal.priority,
            progress: goal.progress,
          })),
        },
        weeklyAttendance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/employee/dashboard-stats error:", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard stats", error: String(error) },
      { status: 500 }
    );
  }
}
