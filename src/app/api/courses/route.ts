import { dbConnect } from "@/lib/db";
import CoursesModel from "@/models/courses";
import { initialLearningPrograms } from "@/data/skillDevelopmentData";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    let courses = await CoursesModel.find({}).sort({ createdAt: -1 }).lean();
    
    // Auto-seed if the database courses collection is empty
    if (courses.length === 0) {
      const seeded = initialLearningPrograms.map((p) => ({
        courseId: p.id,
        programName: p.name,
        description: p.description,
        category: p.category,
        duration: p.duration,
        level: p.level,
        department: p.department,
        instructor: p.instructor,
        resources: p.resources,
        assignments: p.assignments,
        progress: p.progress,
        enrolledUsers: [],
        status: p.status,
      }));
      await CoursesModel.insertMany(seeded);
      courses = await CoursesModel.find({}).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error("GET /api/courses error:", error);
    return NextResponse.json({ message: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      id,
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
      enrolledUserIds,
      enrolledUsers,
      courseId: courseIdFromBody,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json({ message: "Program name is required" }, { status: 400 });
    }

    const course = await CoursesModel.create({
      courseId: id || courseIdFromBody || `prog-${Math.random().toString(36).slice(2, 8)}`,
      programName: name.trim(),
      description: description?.trim() ?? "",
      category: category || "Technical",
      duration: duration?.trim() ?? "",
      level: level || "Beginner",
      department: department || "Engineering",
      instructor: instructor?.trim() ?? "",
      resources: Number(resources) || 0,
      assignments: Number(assignments) || 0,
      progress: Number(progress) || 0,
      enrolledUsers: Array.isArray(enrolledUsers) ? enrolledUsers : [],
      enrolledUserIds: Array.isArray(enrolledUserIds) ? enrolledUserIds : [],
      status: status || "Active",
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error("POST /api/courses error:", error);
    return NextResponse.json({ message: "Failed to create course" }, { status: 500 });
  }
}
