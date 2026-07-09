import mongoose from "mongoose";

const certifications = new mongoose.Schema(
    {
        certificateId: {
            type: String,
            required: true,
            unique: true,
        },
        certificateName: {
            type: String,
            required: true,
        },
        duration: {
            type: String,
            default: "",
        },
        startDate:{
            type: Date,
        },
        endDate: {
            type: Date,
        },  
        department: {
            type: String,
            required: true,
        },
        issuer: {
            type: String,
            required: true,
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
        status: {
            type: String,
            enum: ["Valid", "Expiring Soon", "Expired", "Pending Verification"],
            default: "Active",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { collection: "courses" }
);

export default mongoose.models.certificateName ||
    mongoose.model("Certifications", certifications);

