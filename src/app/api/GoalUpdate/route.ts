import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "GoalUpdate API Placeholder" }, { status: 200 });
}
