import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import LeaveRequest from "@/models/LeaveRequest";
import WFHRequests from "@/models/WFHRequests";
import CompOffRequest from "@/models/CompOffRequest";
import { NextResponse } from "next/server";



export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }
        // Only managers should access this endpoint
        if (session.user.role !== "MANAGER") {
            return NextResponse.json(
                { message: "Forbidden: Manager access only" },
                { status: 403 }
            );
        }
        await dbConnect();

        // Find all employees whose 'manager' field matches the logged-in manager's userId
        const teamMembers = await User.find(
            { manager: session.user.userId },
            {
                name: 1,
                email: 1,
                userId: 1,
                role: 1,
                department: 1,
                designation: 1,
                joiningDate: 1,
                phone: 1,
                gender: 1,
                employmentType: 1,
                workLocation: 1,
                profileImage: 1,
            }
        )
            .sort({ name: 1 })
            .lean();

        // --- Determine today's attendance status for each member ---
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1);

        const employeeIds = teamMembers.map((m) => m.userId);

        // Batch-fetch approved records covering today for all team members
        const [approvedLeaves, approvedWFH, approvedCompOff] = await Promise.all([
            // Leave: APPROVED and today within [startDate, endDate]
            LeaveRequest.find(
                {
                    employeeId: { $in: employeeIds },
                    status: "APPROVED",
                    startDate: { $lte: todayEnd },
                    endDate: { $gte: todayStart },
                },
                { employeeId: 1 }
            ).lean(),

            // WFH: APPROVED and today within [startDate, endDate]
            WFHRequests.find(
                {
                    employeeId: { $in: employeeIds },
                    status: "APPROVED",
                    startDate: { $lte: todayEnd },
                    endDate: { $gte: todayStart },
                },
                { employeeId: 1 }
            ).lean(),

            // Comp-Off: APPROVED and workDate falls on today
            CompOffRequest.find(
                {
                    employeeId: { $in: employeeIds },
                    status: "APPROVED",
                    workDate: { $gte: todayStart, $lte: todayEnd },
                },
                { employeeId: 1 }
            ).lean(),
        ]);

        // Build O(1) lookup sets
        const onLeaveIds = new Set(approvedLeaves.map((r: { employeeId: string }) => r.employeeId));
        const onWFHIds = new Set(approvedWFH.map((r: { employeeId: string }) => r.employeeId));
        const onCompOffIds = new Set(approvedCompOff.map((r: { employeeId: string }) => r.employeeId));

        // Attach todayStatus (priority: Leave > WFH > Comp-Off > On Duty)
        const enriched = teamMembers.map((member) => {
            let todayStatus: "On Leave" | "WFH" | "Comp-Off" | "On Duty" = "On Duty";
            if (onLeaveIds.has(member.userId)) todayStatus = "On Leave";
            else if (onWFHIds.has(member.userId)) todayStatus = "WFH";
            else if (onCompOffIds.has(member.userId)) todayStatus = "Comp-Off";
            return { ...member, todayStatus };
        });

        return NextResponse.json(
            { teamMembers: enriched },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET /api/myTeamDetail error:", error);
        return NextResponse.json(
            { message: "Failed to fetch team members" },
            { status: 500 }
        );
    }
}
