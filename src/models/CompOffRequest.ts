import mongoose from "mongoose";

const CompOffRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: true,
      index: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    managerId: {
      type: String,
      required: true,
    },
    managerName: {
      type: String,
      required: true,
    },
    workDate: {
      type: Date,
      required: true,
    },
    workType: {
      type: String,
      enum: [
        "Weekend Deployment Support",
        "Critical Release Weekend Work",
        "Holiday On-call Duty",
        "Production Support",
        "Emergency Maintenance",
        "Other",
      ],
      required: true,
    },
    hoursWorked: {
      type: Number,
      required: true,
      min: 1,
      max: 24,
    },
    reason: {
      type: String,
      required: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    managerComment: {
      type: String,
      default: "",
    },
    compOffDaysEarned: {
      type: Number,
      default: 0,
    },
    approvalDate: {
      type: Date,
      default: null,
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
  { timestamps: true }
);

export default mongoose.models.CompOffRequest ||
  mongoose.model("CompOffRequest", CompOffRequestSchema);
