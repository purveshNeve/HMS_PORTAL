import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import GoalModel from "@/models/Goal";
import { NextResponse } from "next/server";

// GET — employee fetches their own goals; manager fetches goals they created
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();

    const filter =
      session.user.role === "MANAGER"
        ? { createdBy: session.user.userId }
        : { assignedTo: session.user.userId };

    const goals = await GoalModel.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ goals }, { status: 200 });
  } catch (error) {
    console.error("GET /api/goals error:", error);
    return NextResponse.json({ message: "Failed to fetch goals" }, { status: 500 });
  }
}

// POST — manager creates a new goal and assigns it to an employee
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "MANAGER") {
      return NextResponse.json({ message: "Only managers can create goals" }, { status: 403 });
    }
    await dbConnect();

    const body = await req.json();
    const { title, description, category, status, priority, progress, startDate, dueDate, tags, assignedTo } = body;

    if (!title?.trim()) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }
    if (!assignedTo?.trim()) {
      return NextResponse.json({ message: "Assigned employee ID is required" }, { status: 400 });
    }

    const goal = await GoalModel.create({
      title: title.trim(),
      description: description?.trim() ?? "",
      category: category ?? "performance",
      status: status ?? "not_started",
      priority: priority ?? "medium",
      progress: progress ?? 0,
      startDate,
      dueDate,
      tags: tags ?? [],
      managerApproved: true,
      createdBy: session.user.userId,
      assignedTo: assignedTo.trim(),
      milestones: [],
      comments: [],
    });

    return NextResponse.json({ goal }, { status: 201 });
  } catch (error) {
    console.error("POST /api/goals error:", error);
    return NextResponse.json({ message: "Failed to create goal" }, { status: 500 });
  }
}
