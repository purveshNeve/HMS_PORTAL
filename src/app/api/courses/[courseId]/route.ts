import { dbConnect } from "@/lib/db";
import CoursesModel from "@/models/courses";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    await dbConnect();
    const { courseId } = await params;
    const body = await req.json();
    const { action, user, userId: bodyUserId } = body;

    if (action !== "enroll") {
      return NextResponse.json({ message: "Unsupported action" }, { status: 400 });
    }

    const userId = bodyUserId || user?.userId || user?.id || "";
    if (!userId) {
      return NextResponse.json({ message: "User is required" }, { status: 400 });
    }

    const course = await CoursesModel.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    const alreadyEnrolled = (course.enrolledUsers || []).some((entry: any) => entry?.userId === userId);
    if (alreadyEnrolled) {
      return NextResponse.json({ course: course.toObject(), enrolled: true }, { status: 200 });
    }

    course.enrolledUsers = [
      ...(course.enrolledUsers || []),
      {
        userId,
        name: user?.name || "",
        email: user?.email || "",
        department: user?.department || "",
        enrolledAt: new Date(),
      },
    ];
    course.enrolledUserIds = Array.from(new Set([...(course.enrolledUserIds || []), userId]));
    course.updatedAt = new Date();
    await course.save();

    const userRecord = await UserModel.findOne({ userId });
    if (userRecord) {
      const hasCourse = (userRecord.enrolledCourses || []).includes(courseId);
      if (!hasCourse) {
        userRecord.enrolledCourses = [...(userRecord.enrolledCourses || []), courseId];
        await userRecord.save();
      }
    }

    return NextResponse.json({ course: course.toObject(), enrolled: true }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/courses/[courseId] error:", error);
    return NextResponse.json({ message: "Failed to enroll in course" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    await dbConnect();
    const { courseId } = await params;
    const body = await req.json();
    
    const {
      name,
      description,
      category,
      duration,
      level,
      department,
      instructor,
      resources,
      assignments,
      progress,
      status,
    } = body;

    const updated = await CoursesModel.findOneAndUpdate(
      { courseId },
      {
        $set: {
          programName: name?.trim(),
          description: description?.trim() ?? "",
          category,
          duration: duration?.trim(),
          level,
          department,
          instructor: instructor?.trim(),
          resources: Number(resources) || 0,
          assignments: Number(assignments) || 0,
          progress: Number(progress) || 0,
          status,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course: updated }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/courses/[courseId] error:", error);
    return NextResponse.json({ message: "Failed to update course" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    await dbConnect();
    const { courseId } = await params;
    
    const deleted = await CoursesModel.findOneAndDelete({ courseId });

    if (!deleted) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/courses/[courseId] error:", error);
    return NextResponse.json({ message: "Failed to delete course" }, { status: 500 });
  }
}
