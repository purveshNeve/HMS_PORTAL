import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["performance", "learning", "project", "personal", "team"],
      default: "performance",
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed", "at_risk", "on_hold"],
      default: "not_started",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    startDate: { type: String, required: true },
    dueDate: { type: String, required: true },
    tags: [{ type: String }],
    managerApproved: { type: Boolean, default: false },
    // Who created (manager) and who it is assigned to (employee)
    createdBy: { type: String, required: true },   // manager userId
    assignedTo: { type: String, required: true },  // employee userId
    milestones: [
      {
        id: { type: String },
        title: { type: String },
        dueDate: { type: String },
        completed: { type: Boolean, default: false },
      },
    ],
    comments: [
      {
        id: { type: String },
        author: { type: String },
        authorRole: { type: String, enum: ["manager", "employee"] },
        text: { type: String },
        date: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);
