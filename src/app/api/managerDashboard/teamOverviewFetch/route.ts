import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";

import User from "@/models/User";
import Goal from "@/models/Goal";
import LeaveRequest from "@/models/LeaveRequest";
import WFHRequests from "@/models/WFHRequests";

function getWorkingDays(start: Date, end: Date) {
    let count = 0;
    const current = new Date(start);

    while (current <= end) {
        const day = current.getDay();

        // Monday-Friday
        if (day !== 0 && day !== 6) {
            count++;
        }

        current.setDate(current.getDate() + 1);
    }

    return count;
}

export async function GET() {
    const session = await auth();

    if (!session?.user) {
        return Response.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        await dbConnect();

        const today = new Date();

        const monthStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        const monthEnd = new Date(
            today.getFullYear(),
            today.getMonth() + 1,
            0,
            23,
            59,
            59,
            999
        );

        const workingDays = getWorkingDays(monthStart, monthEnd);

        const employees = await User.find(
            {
                role: "EMPLOYEE",
                manager: session.user.userId,
            },
            {
                name: 1,
                email: 1,
                department: 1,
                designation: 1,
                profileImage: 1,
                userId: 1,
            }
        ).lean();

        const employeeData = await Promise.all(
            employees.map(async (employee) => {
                const goal = await Goal.findOne({
                    assignedTo: employee.userId,
                    status: "in_progress",
                }).lean();

                const currentLeave = await LeaveRequest.findOne({
                    employeeId: employee.userId,
                    status: "APPROVED",
                    startDate: { $lte: today },
                    endDate: { $gte: today },
                }).lean();

                const approvedLeaves = await LeaveRequest.find({
                    employeeId: employee.userId,
                    status: "APPROVED",
                    startDate: { $lte: monthEnd },
                    endDate: { $gte: monthStart },
                }).lean();

                let leaveDays = 0;

                for (const leave of approvedLeaves) {
                    const start =
                        leave.startDate > monthStart
                            ? leave.startDate
                            : monthStart;

                    const end =
                        leave.endDate < monthEnd
                            ? leave.endDate
                            : monthEnd;

                    const days =
                        Math.floor(
                            (end.getTime() - start.getTime()) /
                            (1000 * 60 * 60 * 24)
                        ) + 1;

                    leaveDays += days;
                }

                const attendance = Math.max(
                    0,
                    Math.round(
                        ((workingDays - leaveDays) / workingDays) * 100
                    )
                );

                const currentWFH = await WFHRequests.findOne({
                    employeeId: employee.userId,
                    status: "APPROVED",
                    startDate: { $lte: today },
                    endDate: { $gte: today },
                }).lean();

                let status = "Active";

                if (currentLeave) {
                    status = "On Leave";
                } else if (currentWFH) {
                    status = "Remote";
                }

                const goalAhead = goal?.progress ?? 0;

                return {
                    id: employee._id.toString(),
                    name: employee.name,
                    email: employee.email,
                    department: employee.department,
                    designation: employee.designation,
                    attendance,
                    status,
                    currentGoal: goal?.title ?? "No Active Goal",
                    goalAhead,
                    profileImage: employee.profileImage,
                };
            })
        );

        return Response.json(employeeData);
    } catch (error) {
        console.error(error);

        return Response.json(
            {
                message: "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}