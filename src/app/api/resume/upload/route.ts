import { NextRequest, NextResponse } from "next/server";
import { parseResume, analyzeResume } from "@/lib/resumeParser";
import { dbConnect } from "@/lib/db";
import ResumeAnalysis from "@/models/ResumeAnalysis";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const goal = (formData.get("goal") as string | null)?.trim() ?? "";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No resume file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = buffer.toString("utf8").slice(0, 4000);

    const parsedResume = await parseResume(resumeText);
    const analysis = await analyzeResume(parsedResume, goal);

    await dbConnect();
    const savedRecord = await ResumeAnalysis.create({
      fileName: file.name,
      goal,
      parsedResume,
      analysis,
    });

    return NextResponse.json(
      {
        success: true,
        data: analysis,
        storedId: savedRecord._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Resume parsing error:", error);

    const message = error instanceof Error ? error.message : "Unknown error";
    const isCreditIssue = /requires more credits|can only afford|credit/i.test(message);

    return NextResponse.json(
      {
        success: false,
        message: isCreditIssue
          ? "Resume analysis could not be completed because OpenRouter credits are exhausted. Please try again later or add credits."
          : "Failed to process resume",
        error: message,
      },
      { status: isCreditIssue ? 402 : 500 }
    );
  }
}