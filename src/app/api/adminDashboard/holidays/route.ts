import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import HolidayModel from "@/models/Holidays";

function normalizeHoliday(holiday: any) {
  return {
    ...holiday,
    id: holiday.id || holiday._id?.toString?.() || holiday.holidayId || `holiday-${Date.now()}`,
    date:
      typeof holiday.date === "string"
        ? holiday.date.slice(0, 10)
        : holiday.date instanceof Date
        ? holiday.date.toISOString().slice(0, 10)
        : new Date(holiday.date).toISOString().slice(0, 10),
  };
}

export async function GET() {
  try {
    await dbConnect();
    const holidays = await HolidayModel.find({}).sort({ date: 1 }).lean();
    return NextResponse.json({ holidays: holidays.map(normalizeHoliday) }, { status: 200 });
  } catch (error) {
    console.error("GET /api/adminDashboard/holidays error:", error);
    return NextResponse.json({ message: "Failed to fetch holidays" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, date, description } = body;

    if (!title?.trim()) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ message: "Date is required" }, { status: 400 });
    }
    if (!description?.trim()) {
      return NextResponse.json({ message: "Description is required" }, { status: 400 });
    }

    await dbConnect();
    const holiday = await HolidayModel.create({
      holidayId: crypto.randomUUID(),
      title: title.trim(),
      date: new Date(date),
      description: description.trim(),
      createdBy: session.user.userId || session.user.id || "",
      createdByName: session.user.name || "",
    });

    return NextResponse.json({ holiday: normalizeHoliday(holiday.toObject()) }, { status: 201 });
  } catch (error) {
    console.error("POST /api/adminDashboard/holidays error:", error);
    return NextResponse.json({ message: "Failed to create holiday" }, { status: 500 });
  }
}
