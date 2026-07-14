import User from "@/models/User";
import CompOff from "@/models/CompOffRequest";
import LeaveRequest from "@/models/LeaveRequest";
import WFHRequests from "@/models/WFHRequests";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";

/** Calculates inclusive calendar days between two dates. */
function calcDays(start: Date, end: Date): number {
    return (
        Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
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
        ).lean<{
            _id: unknown;
            name: string;
            email: string;
            department?: string;
            designation?: string;
            profileImage?: string | null;
            userId: string;
        }[]>();

        const employeeData = await Promise.all(
            employees.map(async (employee) => {
                // ── Leave ──────────────────────────────────────────────
                const currentLeave = await LeaveRequest.findOne({
                    employeeId: employee.userId,
                    status: "PENDING",
                    startDate: { $lte: today },
                    endDate: { $gte: today },
                }).lean<{
                    requestId: string;
                    startDate: Date;
                    endDate: Date;
                    isHalfDay?: boolean;
                    leaveType?: string;
                    reason?: string;
                } | null>();

                // Half-day = 0.5, otherwise count inclusive calendar days
                const leaveRequestDays = currentLeave
                    ? currentLeave.isHalfDay
                        ? 0.5
                        : calcDays(
                            new Date(currentLeave.startDate),
                            new Date(currentLeave.endDate)
                        )
                    : 0;

                // ── WFH ───────────────────────────────────────────────
                const wfhRequest = await WFHRequests.findOne({
                    employeeId: employee.userId,
                    status: "PENDING",
                    startDate: { $lte: today },
                    endDate: { $gte: today },
                }).lean<{
                    requestId: string;
                    startDate: Date;
                    endDate: Date;
                    reason?: string;
                } | null>();

                // Count inclusive calendar days for WFH
                const wfhRequestDays = wfhRequest
                    ? calcDays(
                        new Date(wfhRequest.startDate),
                        new Date(wfhRequest.endDate)
                    )
                    : 0;

                // ── Comp-off ──────────────────────────────────────────
                const compOffRequest = await CompOff.findOne({
                    employeeId: employee.userId,
                    status: "PENDING",
                }).lean<{
                    requestId: string;
                    hoursWorked: number;
                    compOffDaysEarned: number;
                    workType?: string;
                    reason?: string;
                    workDate?: Date;
                } | null>();

                // Days earned: use stored compOffDaysEarned, or derive from hours (≥8h = 1 day, else 0.5)
                const compOffDays = compOffRequest
                    ? compOffRequest.compOffDaysEarned > 0
                        ? compOffRequest.compOffDaysEarned
                        : compOffRequest.hoursWorked >= 8
                            ? 1
                            : 0.5
                    : 0;

                return {
                    id: String(employee._id),
                    name: employee.name,
                    email: employee.email,
                    department: employee.department,
                    designation: employee.designation,
                    profileImage: employee.profileImage,
                    userId: employee.userId,
                    pendingLeave: currentLeave
                        ? { ...currentLeave, days: leaveRequestDays }
                        : null,
                    pendingWFH: wfhRequest
                        ? { ...wfhRequest, days: wfhRequestDays }
                        : null,
                    pendingCompOff: compOffRequest
                        ? { ...compOffRequest, days: compOffDays }
                        : null,
                };
            })
        );

        return Response.json(employeeData);
    } catch (error) {
        console.error(error);
        return Response.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}