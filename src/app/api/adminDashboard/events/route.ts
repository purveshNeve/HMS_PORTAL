import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import UpcomingEventModel from "@/models/UpcomingEvents";

function normalizeEvent(event: any) {
  return {
    ...event,
    id: event.id || event._id?.toString?.() || event.eventId || `event-${Date.now()}`,
    date:
      typeof event.date === "string"
        ? event.date
        : event.date instanceof Date
        ? event.date.toISOString().slice(0, 10)
        : new Date(event.date).toISOString().slice(0, 10),
  };
}

export async function GET() {
  try {
    await dbConnect();
    const persistedEvents = await UpcomingEventModel.find({}).sort({ date: 1, time: 1 }).lean();
    return NextResponse.json({ events: persistedEvents.map(normalizeEvent) }, { status: 200 });
  } catch (error) {
    console.error("GET /api/adminDashboard/events error:", error);
    return NextResponse.json({ events: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      emoji,
      date,
      time,
      venue,
      organizer,
      department,
      description,
      category,
      participants,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ message: "Date is required" }, { status: 400 });
    }
    if (!time) {
      return NextResponse.json({ message: "Time is required" }, { status: 400 });
    }
    if (!venue?.trim()) {
      return NextResponse.json({ message: "Venue is required" }, { status: 400 });
    }
    if (!organizer?.trim()) {
      return NextResponse.json({ message: "Organizer is required" }, { status: 400 });
    }
    if (!department?.trim()) {
      return NextResponse.json({ message: "Department is required" }, { status: 400 });
    }
    if (!description?.trim()) {
      return NextResponse.json({ message: "Description is required" }, { status: 400 });
    }
    if (!category?.trim()) {
      return NextResponse.json({ message: "Category is required" }, { status: 400 });
    }

    await dbConnect();

    const createdEvent = await UpcomingEventModel.create({
      eventId: crypto.randomUUID(),
      title: title.trim(),
      emoji: emoji?.trim() || "🎉",
      date: new Date(date),
      time: time.trim(),
      venue: venue.trim(),
      organizer: organizer.trim(),
      department: department.trim(),
      description: description.trim(),
      category: category.trim(),
      participants: Number(participants ?? 0),
      createdBy: session.user.userId || session.user.id || "",
      createdByName: session.user.name || "",
    });

    return NextResponse.json({ event: normalizeEvent(createdEvent.toObject()) }, { status: 201 });
  } catch (error) {
    console.error("POST /api/adminDashboard/events error:", error);
    return NextResponse.json({ message: "Failed to create event" }, { status: 500 });
  }
}
