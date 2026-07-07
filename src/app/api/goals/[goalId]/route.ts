import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import GoalModel from "@/models/Goal";
import { NextResponse } from "next/server";

/**
 * PATCH /api/goals/[goalId]
 *
 * Handles three actions via the `action` field in the body:
 *
 *  action: "updateProgress"   — employee only: { progress: number }
 *  action: "toggleMilestone"  — employee only: { milestoneId: string }
 *  action: "addMilestone"     — manager only:  { milestone: { title, dueDate } }
 *  action: "addComment"       — manager or employee: { text: string }
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { goalId } = await params;
    const body = await req.json();
    const { action } = body;

    // ── 1. Employee: update progress ──────────────────────────────────────────
    if (action === "updateProgress") {
      if (session.user.role !== "employee") {
        return NextResponse.json({ message: "Only employees can update progress" }, { status: 403 });
      }

      const { progress } = body;
      if (typeof progress !== "number") {
        return NextResponse.json({ message: "progress must be a number" }, { status: 400 });
      }

      const goal = await GoalModel.findOne({ _id: goalId, assignedTo: session.user.userId });
      if (!goal) {
        return NextResponse.json({ message: "Goal not found or access denied" }, { status: 404 });
      }

      goal.progress = Math.min(100, Math.max(0, progress));
      await goal.save();
      return NextResponse.json({ goal }, { status: 200 });
    }

    // ── 2. Employee: toggle a milestone's completed flag ──────────────────────
    if (action === "toggleMilestone") {
      if (session.user.role !== "employee") {
        return NextResponse.json({ message: "Only employees can toggle milestones" }, { status: 403 });
      }

      const { milestoneId } = body;
      if (!milestoneId) {
        return NextResponse.json({ message: "milestoneId is required" }, { status: 400 });
      }

      const goal = await GoalModel.findOne({ _id: goalId, assignedTo: session.user.userId });
      if (!goal) {
        return NextResponse.json({ message: "Goal not found or access denied" }, { status: 404 });
      }

      const milestone = goal.milestones.find(
        (m: { id: string }) => m.id === milestoneId
      );
      if (!milestone) {
        return NextResponse.json({ message: "Milestone not found" }, { status: 404 });
      }

      milestone.completed = !milestone.completed;
      await goal.save();
      return NextResponse.json({ goal }, { status: 200 });
    }

    // ── 3. Manager: add a new milestone to a goal ─────────────────────────────
    if (action === "addMilestone") {
      if (session.user.role !== "manager") {
        return NextResponse.json({ message: "Only managers can add milestones" }, { status: 403 });
      }

      const { milestone } = body;
      if (!milestone?.title?.trim() || !milestone?.dueDate) {
        return NextResponse.json({ message: "Milestone title and dueDate are required" }, { status: 400 });
      }

      const goal = await GoalModel.findOne({ _id: goalId, createdBy: session.user.userId });
      if (!goal) {
        return NextResponse.json({ message: "Goal not found or access denied" }, { status: 404 });
      }

      const newMilestone = {
        id: Date.now().toString(),
        title: milestone.title.trim(),
        dueDate: milestone.dueDate,
        completed: false,
      };

      goal.milestones.push(newMilestone);
      await goal.save();

      return NextResponse.json({ goal, milestone: newMilestone }, { status: 200 });
    }

    // ── 4. Manager or employee: add a comment (HTTP fallback) ─────────────────
    if (action === "addComment") {
      const { text } = body;
      if (!text?.trim()) {
        return NextResponse.json({ message: "Comment text is required" }, { status: 400 });
      }

      const role = session.user.role;
      let goal;

      if (role === "employee") {
        goal = await GoalModel.findOne({ _id: goalId, assignedTo: session.user.userId });
      } else if (role === "manager") {
        goal = await GoalModel.findOne({ _id: goalId, createdBy: session.user.userId });
      } else {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
      }

      if (!goal) {
        return NextResponse.json({ message: "Goal not found or access denied" }, { status: 404 });
      }

      const comment = {
        id: Date.now().toString(),
        author: session.user.name ?? (role === "manager" ? "Manager" : "Employee"),
        authorRole: role,
        text: text.trim(),
        date: new Date().toISOString().split("T")[0],
      };

      goal.comments.push(comment);
      await goal.save();

      return NextResponse.json({ comment }, { status: 200 });
    }

    return NextResponse.json({ message: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("PATCH /api/goals/[goalId] error:", error);
    return NextResponse.json({ message: "Failed to update goal" }, { status: 500 });
  }
}