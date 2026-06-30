import { dbConnect } from "@/lib/db";
import CompOff from "@/models/CompOff";
import CompOffRequest from "@/models/CompOffRequest";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      compOffRequestId,
      employeeId,
      employeeName,
      workDate,
      workType,
      days,
      earnedOn,
      expiryDate,
    } = body;

    // Validation
    if (
      !compOffRequestId ||
      !employeeId ||
      !employeeName ||
      !workType ||
      !days ||
      !earnedOn ||
      !expiryDate
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate expiry date
    const expiry = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    if (expiry < today) {
      return NextResponse.json(
        { error: "Expiry date cannot be in the past" },
        { status: 400 }
      );
    }

    // Generate unique ID
    const compOffId = `COMPOFF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create new CompOff record
    const newCompOff = new CompOff({
      compOffId,
      compOffRequestId,
      employeeId,
      employeeName,
      workType,
      days,
      earnedOn,
      expiryDate,
      status: "Available",
    });

    await newCompOff.save();

    // Update CompOffRequest status to reflect that it has been processed
    await CompOffRequest.findByIdAndUpdate(
      compOffRequestId,
      { status: "APPROVED" },
      { new: true }
    );

    return NextResponse.json(
      { success: true, data: newCompOff },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to allocate comp off:", error);
    return NextResponse.json(
      { error: "Failed to allocate comp off" },
      { status: 500 }
    );
  }
}
