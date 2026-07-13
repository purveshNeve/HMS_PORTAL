import { dbConnect } from "@/lib/db";
import PayrollRecord from "@/models/PayrollRecord";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET /api/payroll/payslips
// Returns the logged-in employee's PayrollRecord history, filtered by status
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const url = new URL(req.url);
    // Optional filter: only SUBMITTED, PROCESSED, PAID records (i.e. "accepted/credited")
    const statusParam = url.searchParams.get("status"); // e.g. "SUBMITTED,PROCESSED,PAID"

    const query: Record<string, unknown> = { employeeId: session.user.userId };
    if (statusParam) {
      const statuses = statusParam.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
      if (statuses.length) query.status = { $in: statuses };
    }

    const records = await PayrollRecord.find(query)
      .sort({ month: -1 })
      .lean();

    return NextResponse.json({ payslips: records }, { status: 200 });
  } catch (error) {
    console.error("GET/api/payroll/payslips error:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch payslips",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
