import { dbConnect } from "@/lib/db";
import CompOffRequest from "@/models/CompOffRequest";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const requests = await CompOffRequest.find({ status: "APPROVED" })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data: requests }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch approved comp-off requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch approved comp-off requests" },
      { status: 500 }
    );
  }
}
