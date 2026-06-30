import { dbConnect } from "@/lib/db";
import WFHRequests from "@/models/WFHRequests";
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
      return NextResponse.json({ error: "managerId, employeeId or status is required" }, { status: 400 });
    }

    const query: Record<string, any> = {};
    if (managerId) query.managerId = managerId;
    if (employeeId) query.employeeId = employeeId;
    if (statusParam) {
      const statuses = statusParam.split(",").map(status => status.trim().toUpperCase()).filter(Boolean);
      if (statuses.length) {
        query.status = { $in: statuses };
      }
    }
    const requests = await WFHRequests.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch WFH requests:", error);
    return NextResponse.json({ error: "Failed to fetch WFH requests" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { employeeId, employeeName, managerId, managerName, startDate, endDate, reason, notifyManager } = body;

    if (!employeeId || !employeeName || !managerId || !managerName || !startDate || !endDate || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const manager = await User.findOne({ userId: managerId, role: "MANAGER" });
    if (!manager) {
      return NextResponse.json(
        { error: "Manager not found or invalid manager ID" },
        { status: 404 }
      );
    }

    const requestId = `WFH-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`;

    const request = await WFHRequests.create({
      requestId,
      employeeId,
      employeeName,
      managerId,
      managerName: manager.name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: "PENDING",
      notifyManager: notifyManager ?? true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "WFH request submitted successfully",
        data: request,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("WFH request error:", error);
    return NextResponse.json(
      { error: "Failed to submit WFH request" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const body = await req.json().catch(() => ({}));
    const { requestId, managerId, status } = body;
    const normalizedStatus = typeof status === 'string' ? status.toUpperCase() : undefined;

    if (!requestId) {
      return NextResponse.json({ error: "requestId is required" }, { status: 400 });
    }
    if (!managerId) {
      return NextResponse.json({ error: "managerId is required" }, { status: 400 });
    }
    if (normalizedStatus !== 'APPROVED' && normalizedStatus !== 'REJECTED') {
      return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
    }

    const manager = await User.findOne({ userId: managerId, role: "MANAGER" });
    if (!manager) {
      return NextResponse.json({ error: "Manager not found" }, { status: 404 });
    }

    const request = await WFHRequests.findOne({ requestId });
    if (!request) {
      return NextResponse.json({ error: "WFH request not found" }, { status: 404 });
    }
    if (request.status !== 'PENDING') {
      return NextResponse.json({ error: "Only pending requests can be updated" }, { status: 400 });
    }

    request.status = normalizedStatus;
    await request.save();

    return NextResponse.json({ success: true, requestId: request.requestId, status: request.status }, { status: 200 });
  } catch (error) {
    console.error("Failed to update WFH request:", error);
    return NextResponse.json({ error: "Failed to update WFH request" }, { status: 500 });
  }
}
