import { dbConnect } from "@/lib/db";
import CompOff from "@/models/CompOff";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const employeeId = url.searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { error: "employeeId is required" },
        { status: 400 }
      );
    }

    const records = await CompOff.find({ employeeId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data: records }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch comp off records:", error);
    return NextResponse.json(
      { error: "Failed to fetch comp off records" },
      { status: 500 }
    );
  }
}
