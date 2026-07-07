import mongoose from "mongoose";

const courses = new mongoose.Schema(
    {
        courseId: {
            type: String,
            required: true,
            unique: true,
        },
        programName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
        category: {
            type: String,
            default: "Technical",
        },
        duration: {
            type: String,
            default: "",
        },
        level: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
        },
        instructor: {
            type: String,
            required: true,
        },
        resources: {
            type: Number,
            default: 0,
        },
        assignments: {
            type: Number,
            default: 0,
        },
        progress: {
            type: Number,
            required: true,
            default: 0,
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
            enum: ["Draft", "Active", "Completed", "Archived", "Upcomming", "Expired", "Available"],
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

export default mongoose.models.Courses ||
    mongoose.model("Courses", courses);

