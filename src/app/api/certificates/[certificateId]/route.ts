import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import CertificateModel from "@/models/Certificate";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ certificateId: string }> }
) {
  try {
    await dbConnect();
    const { certificateId } = await params;
    const body = await req.json();
    const { action, user, userId: bodyUserId } = body;

    if (action !== "enroll") {
      return NextResponse.json({ message: "Unsupported action" }, { status: 400 });
    }

    const userId = bodyUserId || user?.userId || user?.id || "";
    if (!userId) {
      return NextResponse.json({ message: "User is required" }, { status: 400 });
    }

    const certificate = await CertificateModel.findOne({ certificateId });
    if (!certificate) {
      return NextResponse.json({ message: "Certificate not found" }, { status: 404 });
    }

    const alreadyEnrolled =
      (certificate.enrolledUserIds || []).includes(userId) ||
      (certificate.enrolledUsers || []).some((entry: any) => entry?.userId === userId);

    if (alreadyEnrolled) {
      return NextResponse.json({ certificate: certificate.toObject(), enrolled: true }, { status: 200 });
    }

    const enrollmentEntry = {
      userId,
      name: user?.name || "",
      email: user?.email || "",
      department: user?.department || "",
      enrolledAt: new Date(),
    };

    const updatedCertificate = await CertificateModel.findOneAndUpdate(
      { certificateId },
      {
        $push: { enrolledUsers: enrollmentEntry },
        $addToSet: { enrolledUserIds: userId },
        $set: { updatedAt: new Date() },
      },
      { new: true, runValidators: true }
    );

    if (!updatedCertificate) {
      return NextResponse.json({ message: "Failed to update certificate" }, { status: 500 });
    }

    const userRecord = await UserModel.findOne({ userId });
    if (userRecord) {
      const certificateAlreadyAdded = (userRecord.enrolledCertificates || []).includes(certificateId);
      if (!certificateAlreadyAdded) {
        await UserModel.findOneAndUpdate(
          { userId },
          { $addToSet: { enrolledCertificates: certificateId } },
          { new: true }
        );
      }
    }

    return NextResponse.json({ certificate: updatedCertificate.toObject(), enrolled: true }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/certificates/[certificateId] error:", error);
    return NextResponse.json({ message: "Failed to enroll in certificate" }, { status: 500 });
  }
}
