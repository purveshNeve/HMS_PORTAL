import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

// GET recommendations for the logged-in user
export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ userId: session.user.userId }).select("managerRecommendations designation").lean();

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ recommendations: user.managerRecommendations || [] }, { status: 200 });
    } catch (error) {
        console.error("GET /api/recommendations error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// PATCH a new recommendation to a specific employee (Managers only)
export async function PATCH(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "manager") {
            return NextResponse.json({ message: "Forbidden: Manager access only" }, { status: 403 });
        }

        const body = await req.json();
        const { employeeId, comment } = body;

        if (!employeeId || !comment) {
            return NextResponse.json({ message: "Employee ID and comment are required" }, { status: 400 });
        }

        await dbConnect();

        // Check if the employee exists and is managed by this manager
        const employee = await User.findOne({ userId: employeeId, manager: session.user.userId });
        
        if (!employee) {
            return NextResponse.json({ message: "Employee not found or not managed by you" }, { status: 404 });
        }
        
        // Also get manager's designation from the DB if it is not in session
        const managerUser = await User.findOne({ userId: session.user.userId }).select("designation name").lean();

        const newRecommendation = {
            managerName: managerUser?.name || session.user.name,
            role: managerUser?.designation || "Manager",
            comment,
            date: new Date(),
        };

        const updatedUser = await User.findOneAndUpdate(
            { userId: employeeId },
            { $push: { managerRecommendations: newRecommendation } },
            { new: true }
        );

        return NextResponse.json({ message: "Recommendation added successfully", recommendation: newRecommendation }, { status: 200 });
    } catch (error) {
        console.error("PATCH /api/recommendations error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
