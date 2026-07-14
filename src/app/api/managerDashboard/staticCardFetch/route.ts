import User from "@/models/User";
import LeaveRequest from "@/models/LeaveRequest";
import WFHRequests from "@/models/WFHRequests";
import Goal from "@/models/Goal";
import { dbConnect } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
    const session = await auth();
    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        await dbConnect();
        const employeeCount = await User.countDocuments({
            role: "EMPLOYEE",
            manager: session?.user?.userId
        })

        const employees = await User.find(
            {
                role: "EMPLOYEE",
                manager: session?.user?.userId,
            },
            { userId: 1 }
        ).lean();

        const employeeIds = employees.map((emp) => emp.userId);

        const approvedLeaveCount = await LeaveRequest.countDocuments({
            employeeId: { $in: employeeIds },
            status: "APPROVED",
        });
        const activeEmployee = employeeCount - approvedLeaveCount;

        const WfhRequests = await WFHRequests.countDocuments({
            employeeId: { $in: employeeIds },
            status: "APPROVED",
        });

        const pendingLeaveRequest = await LeaveRequest.countDocuments({
            employeeId: { $in: employeeIds },
            status: "PENDING",
        });

        const activeGoals = await Goal.countDocuments({
            assignedTo: { $in: employeeIds },
            status: "in_progress",
        });


        return Response.json({ employeeCount, activeEmployee, WfhRequests, pendingLeaveRequest, activeGoals });
    } catch (error) {
        return Response.json({ error: "Internal server error" });
    }
}