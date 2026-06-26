import mongoose from "mongoose";

const LeaveRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: true,
    },
    employeeName: {
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
    leaveType: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isHalfDay: {
      type: Boolean,
      default: false,
    },
    session: {
      type: String,
      enum: ["", "Morning", "Afternoon"],
      default: "",
    },
    reason: {
      type: String,
      required: true,
    },
    emergencyContact: {
      type: String,
      default: "",
    },
    delegate: {
      type: String,
      default: "",
    },
    document: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
      default: "PENDING",
    },
    notifyManager: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
const LeaveRequest =
  mongoose.models.LeaveRequest ||
  mongoose.model("LeaveRequest", LeaveRequestSchema);

export default LeaveRequest;