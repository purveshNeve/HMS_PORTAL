import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    employee: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    certificateName: {
      type: String,
      required: true,
    },
    issuer: {
      type: String,
      required: true,
    },
    issueDate: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      default: "—",
    },
    status: {
      type: String,
      enum: ["Valid", "Expiring Soon", "Expired", "Pending Verification"],
      default: "Pending Verification",
    },
    fileName: {
      type: String,
      default: "certificate.pdf",
    },
    enrolledUsers: {
      type: [
        {
          userId: { type: String, required: true },
          name: { type: String, default: "" },
          email: { type: String, default: "" },
          department: { type: String, default: "" },
          enrolledAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    enrolledUserIds: {
      type: [String],
      default: [],
    },
  },
  {
    collection: "certificates",
    timestamps: true,
  }
);

export default mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);
