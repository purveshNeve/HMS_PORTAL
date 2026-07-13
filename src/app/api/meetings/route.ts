import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import MeetingModel from "@/models/Meeting";

export async function GET() {
  try {
    await dbConnect();
    const meetings = await MeetingModel.find({}).sort({ date: 1, time: 1 }).lean();
    return NextResponse.json({ meetings }, { status: 200 });
  } catch (error) {
    console.error("GET /api/meetings error:", error);
    return NextResponse.json({ message: "Failed to fetch meetings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "manager") {
      return NextResponse.json({ message: "Only managers can schedule meetings" }, { status: 403 });
    }

    const body = await req.json();
    const { title, date, time, duration, note, attendees } = body;

    if (!title?.trim()) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ message: "Date is required" }, { status: 400 });
    }
    if (!time) {
      return NextResponse.json({ message: "Time is required" }, { status: 400 });
    }
    if (!duration?.trim()) {
      return NextResponse.json({ message: "Duration is required" }, { status: 400 });
    }

    await dbConnect();

    const meeting = await MeetingModel.create({
      title: title.trim(),
      date: new Date(date),
      time,
      duration: duration.trim(),
      note: note?.trim() ?? "",
      attendees: Array.isArray(attendees) ? attendees : [],
      createdBy: session.user.userId,
      createdByName: session.user.name,
    });

    return NextResponse.json({ meeting }, { status: 201 });
  } catch (error) {
    console.error("POST /api/meetings error:", error);
    return NextResponse.json({ message: "Failed to create meeting" }, { status: 500 });
  }
}
