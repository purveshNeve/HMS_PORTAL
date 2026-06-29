import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const employees = await User.find(
      { role: { $in: ["EMPLOYEE", "MANAGER", "ADMIN"] } },
      {
        name: 1,
        email: 1,
        userId: 1,
        role: 1,
        department: 1,
        joiningDate: 1,
        profileImage: 1,
      }
    ).lean();
    return NextResponse.json(employees);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}