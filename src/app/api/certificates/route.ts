import { dbConnect } from "@/lib/db";
import CertificateModel from "@/models/Certificate";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const certificates = await CertificateModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ certificates }, { status: 200 });
  } catch (error) {
    console.error("GET /api/certificates error:", error);
    return NextResponse.json({ message: "Failed to fetch certificates" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const {
      id,
      employee,
      department,
      certificateName,
      issuer,
      issueDate,
      expiryDate,
      status,
      fileName,
    } = body;

    if (!employee?.trim() || !certificateName?.trim() || !issuer?.trim() || !issueDate?.trim()) {
      return NextResponse.json({ message: "Missing required certificate fields" }, { status: 400 });
    }

    const certificateData = {
      certificateId: id || `cert-${Math.random().toString(36).slice(2, 8)}`,
      employee: employee.trim(),
      department: department || "",
      certificateName: certificateName.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate.trim(),
      expiryDate: expiryDate?.trim() || "—",
      status: status || "Pending Verification",
      fileName: fileName || "certificate.pdf",
    };

    const certificate = await CertificateModel.findOneAndUpdate(
      { certificateId: certificateData.certificateId },
      certificateData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json({ certificate }, { status: 201 });
  } catch (error) {
    console.error("POST /api/certificates error:", error);
    return NextResponse.json({ message: "Failed to create certificate" }, { status: 500 });
  }
}
