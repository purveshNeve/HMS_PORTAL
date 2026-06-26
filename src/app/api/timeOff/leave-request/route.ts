import { dbConnect } from "@/lib/db";
import LeaveRequest from "@/models/LeaveRequest";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const {
      managerId,
      managerName,
      reason,
      startDate,
      endDate,
      leaveType,
      isHalfDay,
      session,
      emergencyContact,
      delegate,
      notifyManager,
      employeeId,
      employeeName,
    } = await req.json();

    // Validate required fields
    if (!managerId || !managerName || !reason || !startDate || !endDate) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find manager in database
    const manager = await User.findOne({
      userId: managerId,
      role: "MANAGER",
    });

    if (!manager) {
      return Response.json(
        { error: "Manager not found or invalid manager ID" },
        { status: 404 }
      );
    }

    // Verify manager name matches (optional security check)
    if (manager.name.toLowerCase() !== managerName.toLowerCase()) {
      console.warn(
        `Manager name mismatch: expected ${manager.name}, got ${managerName}`
      );
    }

    // Create leave request
    const requestId = `LR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;

    const leaveRequest = new LeaveRequest({
      requestId,
      employeeId: employeeId || "EMPLOYEE_001", // This should come from authenticated session
      employeeName: employeeName || "Current Employee", // This should come from authenticated session
      managerId,
      managerName: manager.name,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isHalfDay,
      session,
      reason,
      emergencyContact,
      delegate,
      status: "PENDING",
      notifyManager,
    });

    await leaveRequest.save();

    // TODO: Send email notification to manager if notifyManager is true
    if (notifyManager) {
      console.log(`Notifying manager ${manager.email} about leave request`);
      // await sendLeaveRequestNotification(manager.email, leaveRequest);
    }

    return Response.json(
      {
        success: true,
        requestId,
        message: `Leave request submitted to ${manager.name}`,
        manager: {
          id: manager.userId,
          name: manager.name,
          email: manager.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Leave request error:", error);
    return Response.json(
      { error: "Failed to process leave request" },
      { status: 500 }
    );
  }
}
