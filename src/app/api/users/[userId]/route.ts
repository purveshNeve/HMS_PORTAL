import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    await dbConnect();

    const user = await User.findOne(
      { userId: params.userId, role: "MANAGER" },
      { userId: 1, name: 1, role: 1 }
    ).lean();

    if (!user) {
      return NextResponse.json(
        { error: "Manager not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error) {
    console.error("GET /api/users/[userId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch manager details" },
      { status: 500 }
    );
  }
}
