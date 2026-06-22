import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, name, email, password, role } = await req.json();
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      userId,
      name,
      email,
      password: hashedPassword,
      role,
    });
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}