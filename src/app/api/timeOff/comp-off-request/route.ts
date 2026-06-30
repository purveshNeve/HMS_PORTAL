import { dbConnect } from "@/lib/db";
import CompOffRequest from "@/models/CompOffRequest";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const managerId = url.searchParams.get("managerId");
    const employeeId = url.searchParams.get("employeeId");
    const statusParam = url.searchParams.get("status");

    if (!managerId && !employeeId && !statusParam) {
      return NextResponse.json(
        { error: "managerId, employeeId or status is required" },
        { status: 400 }
      );
    }

    const query: Record<string, any> = {};
    if (managerId) query.managerId = managerId;
    if (employeeId) query.employeeId = employeeId;
    if (statusParam) {
      const statuses = statusParam
        .split(",")
        .map((status) => status.trim().toUpperCase())
        .filter(Boolean);
      if (statuses.length) {
        query.status = { $in: statuses };
      }
    }

    const requests = await CompOffRequest.find(query)
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch comp-off requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch comp-off requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      employeeId,
      employeeName,
      department,
      managerId,
      managerName,
      workDate,
      workType,
      hoursWorked,
      reason,
    } = body;

    // Validation
    if (
      !employeeId ||
      !employeeName ||
      !department ||
      !managerId ||
      !managerName ||
      !workDate ||
      !workType ||
      hoursWorked === undefined ||
      hoursWorked === null ||
      !reason
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate work date is not in the future
    const workDateObj = new Date(workDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    workDateObj.setHours(0, 0, 0, 0);

    if (workDateObj > today) {
      return NextResponse.json(
        { error: "Work date cannot be in the future" },
        { status: 400 }
      );
    }

    // Validate hours worked
    if (hoursWorked < 1 || hoursWorked > 24) {
      return NextResponse.json(
        { error: "Hours worked must be between 1 and 24" },
        { status: 400 }
      );
    }

    // Validate reason length
    if (reason.length > 500) {
      return NextResponse.json(
        { error: "Reason must not exceed 500 characters" },
        { status: 400 }
      );
    }

    // Verify manager exists
    const manager = await User.findOne({
      userId: managerId,
      role: "MANAGER",
    });
    if (!manager) {
      return NextResponse.json(
        { error: "Manager not found or invalid manager ID" },
        { status: 404 }
      );
    }

    // Verify employee exists
    const employee = await User.findOne({ userId: employeeId });
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Generate request ID
    const requestId = `COMPOFF-${new Date().getFullYear()}-${Math.floor(
      Math.random() * 10000
    )
      .toString()
      .padStart(4, "0")}`;

    // Calculate comp off days earned (e.g., 8 hours = 1 day)
    const compOffDaysEarned = Math.ceil(hoursWorked / 8);

    const compOffRequest = await CompOffRequest.create({
      requestId,
      employeeId,
      employeeName,
      department,
      managerId,
      managerName: manager.name,
      workDate: new Date(workDate),
      workType,
      hoursWorked,
      reason,
      status: "PENDING",
      compOffDaysEarned,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Comp-off request submitted successfully",
        data: compOffRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comp-off request error:", error);
    return NextResponse.json(
      { error: "Failed to submit comp-off request" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const body = await req.json().catch(() => ({}));
    const { requestId, managerId, status, managerComment } = body;
    const normalizedStatus = typeof status === "string"
      ? status.toUpperCase()
      : undefined;

    if (!requestId) {
      return NextResponse.json(
        { error: "requestId is required" },
        { status: 400 }
      );
    }

    if (!managerId) {
      return NextResponse.json(
        { error: "managerId is required" },
        { status: 400 }
      );
    }

    // Verify manager
    const manager = await User.findOne({
      userId: managerId,
      role: "MANAGER",
    });
    if (!manager) {
      return NextResponse.json(
        { error: "Manager not found" },
        { status: 404 }
      );
    }

    if (normalizedStatus && !["APPROVED", "REJECTED"].includes(normalizedStatus)) {
      return NextResponse.json(
        { error: "Invalid status. Must be APPROVED or REJECTED" },
        { status: 400 }
      );
    }

    const compOffRequest = await CompOffRequest.findOne({ requestId });

    if (!compOffRequest) {
      return NextResponse.json(
        { error: "Comp-off request not found" },
        { status: 404 }
      );
    }

    if (compOffRequest.managerId !== managerId) {
      return NextResponse.json(
        {
          error: "You do not have permission to update this request",
        },
        { status: 403 }
      );
    }

    if (normalizedStatus) {
      compOffRequest.status = normalizedStatus;
      // Set approval date when status is changed to APPROVED
      if (normalizedStatus === "APPROVED") {
        compOffRequest.approvalDate = new Date();
      }
    }

    if (managerComment) {
      compOffRequest.managerComment = managerComment;
    }

    compOffRequest.updatedAt = new Date();
    await compOffRequest.save();

    return NextResponse.json(
      {
        success: true,
        message: "Comp-off request updated successfully",
        data: compOffRequest,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating comp-off request:", error);
    return NextResponse.json(
      { error: "Failed to update comp-off request" },
      { status: 500 }
    );
  }
}
