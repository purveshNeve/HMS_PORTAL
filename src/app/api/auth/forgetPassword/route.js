import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }
    const normalizedEmail = email.toString().trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "If an account exists with that email, a password reset link has been sent.",
        },
        { status: 200 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(
      Date.now() + 60 * 60 * 1000
    );
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiry;
    await user.save();
    await sendPasswordResetEmail(user.email, token);
    return NextResponse.json(
      {
        message:
          "If an account exists with that email, a password reset link has been sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    return NextResponse.json(
      {
        message: "Unable to process password reset request.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}